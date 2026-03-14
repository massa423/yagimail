package com.example.yagimail.domain.model

data class MailDetail(
    val id: String,
    val subject: String,
    val from: String,
    val to: List<String>,
    val cc: List<String>,
    val receivedDate: String,
    val isStarred: Boolean,
    val isRead: Boolean,
    val bodyText: String?,
    val bodyHtml: String?,
)
