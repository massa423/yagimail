package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.model.MailItem
import org.springframework.stereotype.Service

@Service
class GetMailListUseCase(
    private val mailGateway: MailGateway
) {
    fun execute(): List<MailItem> {
        return mailGateway.getMailList()
    }
}
