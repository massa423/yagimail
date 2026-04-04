package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import org.springframework.stereotype.Service

@Service
class MoveToTrashUseCase(
    private val mailGateway: MailGateway
) {
    fun execute(folderId: String, mailIds: List<String>) =
        mailGateway.moveToTrash(folderId, mailIds)
}
