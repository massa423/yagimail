package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.usecase.GetMailUseCase
import com.example.yagimail.usecase.MarkReadUseCase
import com.example.yagimail.usecase.MoveToTrashUseCase
import com.example.yagimail.usecase.ToggleFlagUseCase
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.willDoNothing
import org.mockito.BDDMockito.willThrow
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(MailController::class)
class MailControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getMailUseCase: GetMailUseCase

    @MockitoBean
    private lateinit var toggleFlagUseCase: ToggleFlagUseCase

    @MockitoBean
    private lateinit var moveToTrashUseCase: MoveToTrashUseCase

    @MockitoBean
    private lateinit var markReadUseCase: MarkReadUseCase

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

    @Test
    fun `PATCH api v1 folders folderId mails mailId flag はフラグを切り替えてisStarredを返す`() {
        given(toggleFlagUseCase.execute("INBOX", "12345")).willReturn(true)

        mockMvc.perform(patch("/api/v1/folders/INBOX/mails/12345/flag"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.isStarred").value(true))
    }

    @Test
    fun `PATCH api v1 folders folderId mails mailId flag は存在しないmailIdに対して404を返す`() {
        given(toggleFlagUseCase.execute("INBOX", "99999"))
            .willThrow(NoSuchElementException("Mail not found: 99999"))

        mockMvc.perform(patch("/api/v1/folders/INBOX/mails/99999/flag"))
            .andExpect(status().isNotFound())
    }

    @Test
    fun `PATCH api v1 folders folderId mails read は複数メールを既読にして204を返す`() {
        willDoNothing().given(markReadUseCase).execute("INBOX", listOf("12345", "67890"), true)

        mockMvc.perform(
            patch("/api/v1/folders/INBOX/mails/read")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":["12345","67890"],"isRead":true}""")
        ).andExpect(status().isNoContent())
    }

    @Test
    fun `PATCH api v1 folders folderId mails read は複数メールを未読にして204を返す`() {
        willDoNothing().given(markReadUseCase).execute("INBOX", listOf("12345", "67890"), false)

        mockMvc.perform(
            patch("/api/v1/folders/INBOX/mails/read")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":["12345","67890"],"isRead":false}""")
        ).andExpect(status().isNoContent())
    }

    @Test
    fun `PATCH api v1 folders folderId mails read は存在しないmailIdに対して404を返す`() {
        willThrow(NoSuchElementException("No mails found"))
            .given(markReadUseCase).execute("INBOX", listOf("99999"), true)

        mockMvc.perform(
            patch("/api/v1/folders/INBOX/mails/read")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":["99999"],"isRead":true}""")
        ).andExpect(status().isNotFound())
    }

    @Test
    fun `PATCH api v1 folders folderId mails read は空のmailIdsに対して400を返す`() {
        mockMvc.perform(
            patch("/api/v1/folders/INBOX/mails/read")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":[],"isRead":true}""")
        ).andExpect(status().isBadRequest())
    }

    @Test
    fun `POST api v1 folders folderId mails trash は複数メールをゴミ箱へ移動して204を返す`() {
        willDoNothing().given(moveToTrashUseCase).execute("INBOX", listOf("12345", "67890"))

        mockMvc.perform(
            post("/api/v1/folders/INBOX/mails/trash")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":["12345","67890"]}""")
        ).andExpect(status().isNoContent())
    }

    @Test
    fun `POST api v1 folders folderId mails trash は存在しないmailIdに対して404を返す`() {
        willThrow(NoSuchElementException("No mails found"))
            .given(moveToTrashUseCase).execute("INBOX", listOf("99999"))

        mockMvc.perform(
            post("/api/v1/folders/INBOX/mails/trash")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"mailIds":["99999"]}""")
        ).andExpect(status().isNotFound())
    }
}
