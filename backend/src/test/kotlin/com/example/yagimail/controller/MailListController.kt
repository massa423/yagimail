package com.example.yagimail.controller

import com.example.yagimail.domain.model.MailItem
import com.example.yagimail.usecase.GetMailListUseCase
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.net.URI

@WebMvcTest(MailListController::class)
class MailListControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getMailListUseCase: GetMailListUseCase

    @Test
    fun `GET api v1 folders folderId mails は指定フォルダのメール一覧を返す`() {
        val mockMails = listOf(
            MailItem(id = "1", displayName = "Alice", subject = "Hello", receivedDate = "2024/01/01 10:00", isStarred = false, isRead = true, senderIcon = "user"),
            MailItem(id = "2", displayName = "Bob", subject = "World", receivedDate = "2024/01/02 11:00", isStarred = true, isRead = false, senderIcon = "user"),
        )
        given(getMailListUseCase.execute("INBOX")).willReturn(mockMails)

        mockMvc.perform(get("/api/v1/folders/INBOX/mails"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].id").value("1"))
            .andExpect(jsonPath("$[0].displayName").value("Alice"))
            .andExpect(jsonPath("$[0].isRead").value(true))
            .andExpect(jsonPath("$[1].id").value("2"))
            .andExpect(jsonPath("$[1].isStarred").value(true))
            .andExpect(jsonPath("$[1].isRead").value(false))
    }

    @Test
    fun `GET api v1 folders folderId mails はURLエンコードされたfolderIdを正しく扱う`() {
        // "[Gmail]/Sent Mail" の [ ] スペースをエンコード（スラッシュはパス区切りのためエンコード不要のフォルダを想定）
        // ここでは "My Folder" -> "My%20Folder" のケースを検証する
        val folderId = "My Folder"
        val mockMails = listOf(
            MailItem(id = "10", displayName = "Carol", subject = "Test", receivedDate = "2024/01/03 12:00", isStarred = false, isRead = true, senderIcon = "user"),
        )
        given(getMailListUseCase.execute(folderId)).willReturn(mockMails)

        // URI.create() を使い %20 を二重エンコードされないようにする
        mockMvc.perform(get(URI.create("/api/v1/folders/My%20Folder/mails")))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].id").value("10"))
    }
}
