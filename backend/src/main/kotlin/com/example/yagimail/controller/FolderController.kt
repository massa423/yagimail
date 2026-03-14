package com.example.yagimail.controller

import com.example.yagimail.domain.model.Folder
import com.example.yagimail.usecase.GetFolderListUseCase
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

data class FolderResponse(
    val id: String,
    val name: String,
    val type: String,
    val messagesTotal: Int,
    val messagesUnread: Int,
)

data class FolderListResponse(
    val folders: List<FolderResponse>,
)

@RestController
class FolderController(
    private val getFolderListUseCase: GetFolderListUseCase,
) {
    @GetMapping("/api/v1/folders")
    fun folderList(): FolderListResponse {
        val folders = getFolderListUseCase.execute()
        return FolderListResponse(
            folders = folders.map { it.toResponse() },
        )
    }

    private fun Folder.toResponse() = FolderResponse(
        id = id,
        name = name,
        type = type.name.lowercase(),
        messagesTotal = messagesTotal,
        messagesUnread = messagesUnread,
    )
}
