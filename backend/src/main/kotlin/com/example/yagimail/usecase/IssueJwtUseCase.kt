package com.example.yagimail.usecase

import com.example.yagimail.domain.model.AuthUser
import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.JWSHeader
import com.nimbusds.jose.crypto.MACSigner
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.SignedJWT
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.Base64
import java.util.Date

@Service
class IssueJwtUseCase(
    @Value("\${jwt.secret}") private val jwtSecretBase64: String,
    @Value("\${jwt.expiration-seconds}") private val expirationSeconds: Long,
) {
    private val secret: ByteArray by lazy { Base64.getDecoder().decode(jwtSecretBase64) }

    fun execute(user: AuthUser): String {
        val now = Instant.now()
        val claims = JWTClaimsSet.Builder()
            .subject(user.sub)
            .claim("email", user.email)
            .claim("name", user.name)
            .issueTime(Date.from(now))
            .expirationTime(Date.from(now.plusSeconds(expirationSeconds)))
            .build()

        val jwt = SignedJWT(JWSHeader(JWSAlgorithm.HS256), claims)
        jwt.sign(MACSigner(secret))
        return jwt.serialize()
    }
}
