package com.example.yagimail.domain.gateway

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.domain.model.MailItem

interface MailGateway {
    fun getMailList(folderId: String): List<MailItem>
    fun getMail(folderId: String, mailId: String): MailDetail?
}
