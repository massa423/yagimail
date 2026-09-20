package com.example.yagimail.controller

import com.example.yagimail.domain.model.OutgoingMail
import com.example.yagimail.usecase.SendMailUseCase
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.willDoNothing
import org.mockito.Mockito.verify
import org.mockito.Mockito.verifyNoInteractions
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(SendMailController::class)
class SendMailControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var sendMailUseCase: SendMailUseCase

    @Test
    fun `POST api v1 mails send はメールを送信して204を返す`() {
        val expected = OutgoingMail(
            to = listOf("a@example.com", "b@example.com"),
            cc = listOf("c@example.com"),
            bcc = emptyList(),
            subject = "テスト件名",
            body = "テスト本文です。",
        )
        willDoNothing().given(sendMailUseCase).execute(expected)

        mockMvc.perform(
            post("/api/v1/mails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """{"to":["a@example.com","b@example.com"],"cc":["c@example.com"],"bcc":[],"subject":"テスト件名","body":"テスト本文です。"}"""
                )
        ).andExpect(status().isNoContent())

        verify(sendMailUseCase).execute(expected)
    }

    @Test
    fun `POST api v1 mails send はcc bcc body省略時もデフォルト値で204を返す`() {
        mockMvc.perform(
            post("/api/v1/mails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"to":["a@example.com"],"subject":"件名のみ"}""")
        ).andExpect(status().isNoContent())

        verify(sendMailUseCase).execute(
            OutgoingMail(
                to = listOf("a@example.com"),
                cc = emptyList(),
                bcc = emptyList(),
                subject = "件名のみ",
                body = "",
            )
        )
    }

    @Test
    fun `POST api v1 mails send は空のtoに対して400を返す`() {
        mockMvc.perform(
            post("/api/v1/mails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"to":[],"subject":"件名"}""")
        ).andExpect(status().isBadRequest())

        verifyNoInteractions(sendMailUseCase)
    }

    @Test
    fun `POST api v1 mails send は空白の件名に対して400を返す`() {
        mockMvc.perform(
            post("/api/v1/mails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"to":["a@example.com"],"subject":"  "}""")
        ).andExpect(status().isBadRequest())

        verifyNoInteractions(sendMailUseCase)
    }

    @Test
    fun `POST api v1 mails send は不正なメールアドレスに対して400を返す`() {
        mockMvc.perform(
            post("/api/v1/mails/send")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"to":["not-an-email"],"subject":"件名"}""")
        ).andExpect(status().isBadRequest())

        verifyNoInteractions(sendMailUseCase)
    }
}
