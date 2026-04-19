package com.example.yagimail.usecase

import com.example.yagimail.domain.model.AuthUser
import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.jwk.source.JWKSourceBuilder
import com.nimbusds.jose.proc.JWSVerificationKeySelector
import com.nimbusds.jose.proc.SecurityContext
import com.nimbusds.jwt.proc.DefaultJWTProcessor
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.net.URL

@Service
class VerifyGoogleTokenUseCase(
    @Value("\${google.client-id}") private val googleClientId: String,
) {
    private val jwkSource = JWKSourceBuilder
        .create<SecurityContext>(URL("https://www.googleapis.com/oauth2/v3/certs"))
        .build()

    fun execute(idToken: String): AuthUser? {
        return try {
            val processor = DefaultJWTProcessor<SecurityContext>()
            processor.jwsKeySelector = JWSVerificationKeySelector(JWSAlgorithm.RS256, jwkSource)

            val claims = processor.process(idToken, null)

            val aud = claims.audience
            if (!aud.contains(googleClientId)) return null

            val iss = claims.issuer
            if (iss != "https://accounts.google.com" && iss != "accounts.google.com") return null

            AuthUser(
                sub = claims.subject,
                email = claims.getStringClaim("email"),
                name = claims.getStringClaim("name"),
            )
        } catch (_: Exception) {
            null
        }
    }
}
