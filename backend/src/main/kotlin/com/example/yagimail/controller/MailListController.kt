package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailItem
import com.example.yagimail.usecase.GetMailListUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class MailListController(
    private val getMailListUseCase: GetMailListUseCase
) {
    @GetMapping("/api/v1/folders/{folderId}/mails")
    fun mailList(
        @PathVariable folderId: String,
        @RequestParam(defaultValue = "100") limit: Int,
        @RequestParam(defaultValue = "0") offset: Int,
    ): ResponseEntity<List<MailItem>> {
        if (limit < 1 || limit > 300) {
            return ResponseEntity.badRequest().build()
        }
        if (offset < 0) {
            return ResponseEntity.badRequest().build()
        }
        return ResponseEntity.ok(getMailListUseCase.execute(folderId, limit, offset))
    }
}
