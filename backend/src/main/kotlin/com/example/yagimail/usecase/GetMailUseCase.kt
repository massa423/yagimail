package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.model.MailDetail
import org.springframework.stereotype.Service

@Service
class GetMailUseCase(
    private val mailGateway: MailGateway
) {
    fun execute(folderId: String, mailId: String): MailDetail? =
        mailGateway.getMail(folderId, mailId)
}
