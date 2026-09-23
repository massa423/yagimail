package com.example.yagimail.controller

import com.example.yagimail.domain.model.OutgoingMail
import com.example.yagimail.usecase.SendMailUseCase
import jakarta.mail.internet.AddressException
import jakarta.mail.internet.InternetAddress
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class SendMailRequest(
    val to: List<String>,
    val cc: List<String> = emptyList(),
    val bcc: List<String> = emptyList(),
    val subject: String,
    val body: String = "",
)

@RestController
class SendMailController(
    private val sendMailUseCase: SendMailUseCase,
) {
    @PostMapping("/api/v1/mails/send")
    fun sendMail(
        @RequestBody request: SendMailRequest,
    ): ResponseEntity<Void> {
        if (request.to.isEmpty() || request.subject.isBlank()) {
            return ResponseEntity.badRequest().build()
        }
        if (!allAddressesValid(request.to + request.cc + request.bcc)) {
            return ResponseEntity.badRequest().build()
        }
        sendMailUseCase.execute(
            OutgoingMail(
                to = request.to,
                cc = request.cc,
                bcc = request.bcc,
                subject = request.subject,
                body = request.body,
            ),
        )
        return ResponseEntity.noContent().build()
    }

    private fun allAddressesValid(addresses: List<String>): Boolean =
        addresses.all {
            try {
                InternetAddress(it, true)
                true
            } catch (e: AddressException) {
                false
            }
        }
}
