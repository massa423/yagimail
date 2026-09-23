package com.example.yagimail.domain.model

data class OutgoingMail(
    val to: List<String>,
    val cc: List<String>,
    val bcc: List<String>,
    val subject: String,
    val body: String,
)
