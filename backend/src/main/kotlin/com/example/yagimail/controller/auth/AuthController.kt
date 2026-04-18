package com.example.yagimail.controller.auth

import com.example.yagimail.usecase.IssueJwtUseCase
import com.example.yagimail.usecase.VerifyGoogleTokenUseCase
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class LoginRequest(val idToken: String)

data class LoginResponse(val email: String, val name: String)

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val verifyGoogleTokenUseCase: VerifyGoogleTokenUseCase,
    private val issueJwtUseCase: IssueJwtUseCase,
    @Value("\${jwt.expiration-seconds}") private val expirationSeconds: Long,
) {
    @PostMapping("/login")
    fun login(
        @RequestBody request: LoginRequest,
        response: HttpServletResponse,
    ): ResponseEntity<LoginResponse> {
        val authUser = verifyGoogleTokenUseCase.execute(request.idToken)
            ?: return ResponseEntity.status(401).build()

        val jwt = issueJwtUseCase.execute(authUser)

        // Set-Cookie with SameSite=Strict (jakarta Cookie API doesn't expose SameSite)
        response.addHeader(
            "Set-Cookie",
            "auth_token=$jwt; Path=/; HttpOnly; SameSite=Strict; Max-Age=$expirationSeconds",
        )

        return ResponseEntity.ok(LoginResponse(authUser.email, authUser.name))
    }

    @PostMapping("/logout")
    fun logout(response: HttpServletResponse): ResponseEntity<Void> {
        response.addHeader(
            "Set-Cookie",
            "auth_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
        )
        return ResponseEntity.noContent().build()
    }
}
