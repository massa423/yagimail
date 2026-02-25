package com.example.yagimail.domain.model

data class MailItem(
    val id: String,
    val displayName: String,
    val subject: String,
    val receivedDate: String,
    val isStarred: Boolean,
    val isRead: Boolean,
    val senderIcon: String
)
