package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.gateway.MailSenderGateway
import com.example.yagimail.domain.model.OutgoingMail
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

@Service
class SendMailUseCase(
    private val mailSenderGateway: MailSenderGateway,
    private val mailGateway: MailGateway,
) {
    private val logger = LoggerFactory.getLogger(SendMailUseCase::class.java)

    fun execute(mail: OutgoingMail) {
        val sentMessage = mailSenderGateway.send(mail)
        try {
            mailGateway.appendToSent(sentMessage)
        } catch (e: Exception) {
            // 送信自体は成功しているため、Sent への保存失敗でリクエストは失敗させない
            // (失敗扱いにするとユーザーが再送信して二重送信になるリスクがある)
            logger.warn("メールは送信されましたが送信済みフォルダへの保存に失敗しました: ${e.message}", e)
        }
    }
}
