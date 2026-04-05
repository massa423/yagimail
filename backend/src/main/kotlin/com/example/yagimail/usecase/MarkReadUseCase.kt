package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import org.springframework.stereotype.Service

@Service
class MarkReadUseCase(
    private val mailGateway: MailGateway
) {
    fun execute(folderId: String, mailIds: List<String>, isRead: Boolean) =
        mailGateway.markRead(folderId, mailIds, isRead)
}
