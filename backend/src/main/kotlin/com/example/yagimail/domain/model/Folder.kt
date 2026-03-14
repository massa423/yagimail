package com.example.yagimail.domain.model

enum class FolderType {
    SYSTEM,
    USER,
}

data class Folder(
    val id: String,
    val name: String,
    val type: FolderType,
    val messagesTotal: Int,
    val messagesUnread: Int,
)
