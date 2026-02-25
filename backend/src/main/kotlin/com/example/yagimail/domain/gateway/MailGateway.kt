package com.example.yagimail.domain.gateway

import com.example.yagimail.domain.model.MailItem

interface MailGateway {
    fun getMailList(): List<MailItem>
}
