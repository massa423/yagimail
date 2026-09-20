package com.example.yagimail.gateways

import com.example.yagimail.domain.gateway.MailSenderGateway
import com.example.yagimail.domain.model.OutgoingMail
import jakarta.mail.Authenticator
import jakarta.mail.Message
import jakarta.mail.PasswordAuthentication
import jakarta.mail.Session
import jakarta.mail.Transport
import jakarta.mail.internet.InternetAddress
import jakarta.mail.internet.MimeMessage
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.io.ByteArrayOutputStream
import java.util.*

@Component
class SmtpMailGateway(
    @Value("\${mail.smtp.host}") private val host: String,
    @Value("\${mail.smtp.port}") private val port: Int,
    @Value("\${mail.smtp.username}") private val username: String,
    @Value("\${mail.smtp.password}") private val password: String,
) : MailSenderGateway {
    private val logger = LoggerFactory.getLogger(SmtpMailGateway::class.java)

    private fun createSession(): Session {
        val properties = Properties().apply {
            put("mail.smtp.host", host)
            put("mail.smtp.port", port.toString())
            put("mail.smtp.auth", "true")
            put("mail.smtp.starttls.enable", "true")
        }
        return Session.getInstance(properties, object : Authenticator() {
            override fun getPasswordAuthentication(): PasswordAuthentication =
                PasswordAuthentication(username, password)
        })
    }

    override fun send(mail: OutgoingMail): ByteArray {
        try {
            val message = buildMimeMessage(mail)
            // Message-ID は Transport.send 内の saveChanges で採番されるため、
            // 送信したものと同一の内容を得るには送信後にシリアライズする
            Transport.send(message)
            return message.toRfc822Bytes()
        } catch (e: Exception) {
            logger.error("メール送信でエラーが発生しました: ${e.message}", e)
            throw e
        }
    }

    private fun buildMimeMessage(mail: OutgoingMail): MimeMessage =
        MimeMessage(createSession()).apply {
            setFrom(InternetAddress(username))
            setRecipients(Message.RecipientType.TO, parseAddresses(mail.to))
            if (mail.cc.isNotEmpty()) {
                setRecipients(Message.RecipientType.CC, parseAddresses(mail.cc))
            }
            if (mail.bcc.isNotEmpty()) {
                setRecipients(Message.RecipientType.BCC, parseAddresses(mail.bcc))
            }
            setSubject(mail.subject, "UTF-8")
            setText(mail.body, "UTF-8")
            sentDate = Date()
        }

    private fun parseAddresses(addresses: List<String>): Array<InternetAddress> =
        addresses.map { InternetAddress(it, true) }.toTypedArray()

    // 送信済みメッセージは saved 状態のため、writeTo でヘッダが再生成されることはない
    private fun MimeMessage.toRfc822Bytes(): ByteArray =
        ByteArrayOutputStream().also { writeTo(it) }.toByteArray()
}
