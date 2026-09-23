package com.example.yagimail.domain.gateway

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.domain.model.MailItem

interface MailGateway {
    fun getMailList(
        folderId: String,
        limit: Int,
        offset: Int,
    ): List<MailItem>

    fun getMail(
        folderId: String,
        mailId: String,
    ): MailDetail?

    fun toggleFlag(
        folderId: String,
        mailId: String,
    ): Boolean

    fun moveToTrash(
        folderId: String,
        mailIds: List<String>,
    )

    fun markRead(
        folderId: String,
        mailIds: List<String>,
        isRead: Boolean,
    )

    /** 送信済みメールの RFC822 表現を Sent フォルダへ既読状態で保存する。 */
    fun appendToSent(rawMessage: ByteArray)
}
