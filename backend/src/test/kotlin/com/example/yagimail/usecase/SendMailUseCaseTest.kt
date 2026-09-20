package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.gateway.MailSenderGateway
import com.example.yagimail.domain.model.OutgoingMail
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.willThrow
import org.mockito.InOrder
import org.mockito.Mockito.inOrder
import org.mockito.Mockito.mock
import org.mockito.Mockito.never
import org.mockito.Mockito.verify
import kotlin.test.assertFailsWith

class SendMailUseCaseTest {

    private val mailSenderGateway = mock(MailSenderGateway::class.java)
    private val mailGateway = mock(MailGateway::class.java)
    private val sendMailUseCase = SendMailUseCase(mailSenderGateway, mailGateway)

    private val mail = OutgoingMail(
        to = listOf("a@example.com"),
        cc = emptyList(),
        bcc = emptyList(),
        subject = "テスト件名",
        body = "テスト本文です。",
    )
    private val sentMessage = "Message-ID: <test@example.com>\r\n\r\nテスト本文です。".toByteArray()

    @Test
    fun `送信したメッセージをそのまま送信済みフォルダへ保存する`() {
        given(mailSenderGateway.send(mail)).willReturn(sentMessage)

        sendMailUseCase.execute(mail)

        val order: InOrder = inOrder(mailSenderGateway, mailGateway)
        order.verify(mailSenderGateway).send(mail)
        // Message-ID を保つため、送信時のバイト列がそのまま渡ること
        order.verify(mailGateway).appendToSent(sentMessage)
    }

    @Test
    fun `送信済みフォルダへの保存に失敗しても例外を投げない`() {
        given(mailSenderGateway.send(mail)).willReturn(sentMessage)
        willThrow(RuntimeException("IMAP append failed"))
            .given(mailGateway).appendToSent(sentMessage)

        sendMailUseCase.execute(mail)

        verify(mailSenderGateway).send(mail)
    }

    @Test
    fun `送信に失敗した場合は送信済みフォルダへ保存しない`() {
        willThrow(RuntimeException("SMTP error")).given(mailSenderGateway).send(mail)

        assertFailsWith<RuntimeException> { sendMailUseCase.execute(mail) }

        verify(mailGateway, never()).appendToSent(sentMessage)
    }
}
