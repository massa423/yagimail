package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.usecase.GetMailUseCase
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(MailController::class)
class MailControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getMailUseCase: GetMailUseCase

    @Test
    fun `GET api v1 folders folderId mails mailId はメール詳細をJSON形式で返す`() {
        val mockDetail = MailDetail(
            id = "12345",
            subject = "Hello",
            from = "Alice",
            to = listOf("Bob"),
            cc = emptyList(),
            receivedDate = "2026/01/01 10:00",
            isStarred = false,
            isRead = true,
            bodyText = "Plain text body",
            bodyHtml = "<html><body>HTML body</body></html>",
        )
        given(getMailUseCase.execute("INBOX", "12345")).willReturn(mockDetail)

        mockMvc.perform(get("/api/v1/folders/INBOX/mails/12345"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("12345"))
            .andExpect(jsonPath("$.subject").value("Hello"))
            .andExpect(jsonPath("$.from").value("Alice"))
            .andExpect(jsonPath("$.to[0]").value("Bob"))
            .andExpect(jsonPath("$.cc").isArray())
            .andExpect(jsonPath("$.isRead").value(true))
            .andExpect(jsonPath("$.bodyText").value("Plain text body"))
            .andExpect(jsonPath("$.bodyHtml").value("<html><body>HTML body</body></html>"))
    }

    @Test
    fun `GET api v1 folders folderId mails mailId は存在しないmailIdに対して404を返す`() {
        given(getMailUseCase.execute("INBOX", "99999")).willReturn(null)

        mockMvc.perform(get("/api/v1/folders/INBOX/mails/99999"))
            .andExpect(status().isNotFound())
    }
}
