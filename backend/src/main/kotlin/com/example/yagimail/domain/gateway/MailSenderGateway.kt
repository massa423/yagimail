package com.example.yagimail.domain.gateway

import com.example.yagimail.domain.model.OutgoingMail

interface MailSenderGateway {
    /**
     * メールを送信し、実際に送信したメッセージの RFC822 表現を返す。
     *
     * 返り値をそのまま [MailGateway.appendToSent] に渡すことで、
     * 送信したメールと Sent フォルダの控えが Message-ID まで含めて同一になる。
     */
    fun send(mail: OutgoingMail): ByteArray
}
