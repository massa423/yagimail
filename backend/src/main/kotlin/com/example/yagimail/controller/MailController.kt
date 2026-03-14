package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.usecase.GetMailUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController

@RestController
class MailController(
    private val getMailUseCase: GetMailUseCase
) {
    @GetMapping("/api/v1/folders/{folderId}/mails/{mailId}")
    fun mailDetail(
        @PathVariable folderId: String,
        @PathVariable mailId: String,
    ): ResponseEntity<MailDetail> {
        val detail = getMailUseCase.execute(folderId, mailId)
            ?: return ResponseEntity.notFound().build()
        return ResponseEntity.ok(detail)
    }
}
