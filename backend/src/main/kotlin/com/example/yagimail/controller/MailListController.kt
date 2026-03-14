package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailItem
import com.example.yagimail.usecase.GetMailListUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class MailListController(
    private val getMailListUseCase: GetMailListUseCase
) {
    @GetMapping("/api/v1/folders/{folderId}/mails")
    fun mailList(@PathVariable folderId: String): List<MailItem> {
        return getMailListUseCase.execute(folderId)
    }
}
