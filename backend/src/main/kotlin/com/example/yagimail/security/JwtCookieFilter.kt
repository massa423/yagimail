package com.example.yagimail.security

import com.nimbusds.jose.crypto.MACVerifier
import com.nimbusds.jwt.SignedJWT
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.Base64
import java.util.Date

@Component
class JwtCookieFilter(
    @Value("\${jwt.secret}") private val jwtSecretBase64: String,
) : OncePerRequestFilter() {
    private val secret: ByteArray by lazy { Base64.getDecoder().decode(jwtSecretBase64) }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val token = request.cookies?.firstOrNull { it.name == "auth_token" }?.value

        if (token != null) {
            try {
                val jwt = SignedJWT.parse(token)
                if (jwt.verify(MACVerifier(secret))) {
                    val claims = jwt.jwtClaimsSet
                    if (claims.expirationTime.after(Date())) {
                        val auth = UsernamePasswordAuthenticationToken(
                            claims.subject,
                            null,
                            listOf(SimpleGrantedAuthority("ROLE_USER")),
                        )
                        SecurityContextHolder.getContext().authentication = auth
                    }
                }
            } catch (_: Exception) {
                // Invalid token — leave SecurityContext unauthenticated
            }
        }

        filterChain.doFilter(request, response)
    }
}
