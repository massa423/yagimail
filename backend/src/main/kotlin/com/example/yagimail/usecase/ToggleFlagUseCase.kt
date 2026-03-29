package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import org.springframework.stereotype.Service

@Service
class ToggleFlagUseCase(
    private val mailGateway: MailGateway
) {
    fun execute(folderId: String, mailId: String): Boolean =
        mailGateway.toggleFlag(folderId, mailId)
}
