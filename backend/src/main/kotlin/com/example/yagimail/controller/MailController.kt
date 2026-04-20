package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.usecase.GetMailUseCase
import com.example.yagimail.usecase.MarkReadUseCase
import com.example.yagimail.usecase.MoveToTrashUseCase
import com.example.yagimail.usecase.ToggleFlagUseCase
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

data class FlagResponse(val isStarred: Boolean)
data class MoveToTrashRequest(val mailIds: List<String>)
data class MarkReadRequest(val mailIds: List<String>, val isRead: Boolean)

@RestController
class MailController(
    private val getMailUseCase: GetMailUseCase,
    private val toggleFlagUseCase: ToggleFlagUseCase,
    private val moveToTrashUseCase: MoveToTrashUseCase,
    private val markReadUseCase: MarkReadUseCase,
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

    @PatchMapping("/api/v1/folders/{folderId}/mails/{mailId}/flag")
    fun toggleFlag(
        @PathVariable folderId: String,
        @PathVariable mailId: String,
    ): ResponseEntity<FlagResponse> {
        return try {
            val isStarred = toggleFlagUseCase.execute(folderId, mailId)
            ResponseEntity.ok(FlagResponse(isStarred))
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PatchMapping("/api/v1/folders/{folderId}/mails/read")
    fun markRead(
        @PathVariable folderId: String,
        @RequestBody request: MarkReadRequest,
    ): ResponseEntity<Void> {
        if (request.mailIds.isEmpty()) {
            return ResponseEntity.badRequest().build()
        }
        return try {
            markReadUseCase.execute(folderId, request.mailIds, request.isRead)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }

    @PostMapping("/api/v1/folders/{folderId}/mails/trash")
    fun moveToTrash(
        @PathVariable folderId: String,
        @RequestBody request: MoveToTrashRequest,
    ): ResponseEntity<Void> {
        return try {
            moveToTrashUseCase.execute(folderId, request.mailIds)
            ResponseEntity.noContent().build()
        } catch (e: NoSuchElementException) {
            ResponseEntity.notFound().build()
        }
    }
}
