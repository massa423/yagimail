package com.example.yagimail.controller

import com.example.yagimail.domain.model.Folder
import com.example.yagimail.domain.model.FolderType
import com.example.yagimail.usecase.GetFolderListUseCase
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WebMvcTest(FolderController::class)
class FolderControllerTest {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getFolderListUseCase: GetFolderListUseCase

    @Test
    fun `GET api v1 folders はフォルダ一覧をJSON形式で返す`() {
        val mockFolders = listOf(
            Folder(id = "INBOX", name = "受信トレイ", type = FolderType.SYSTEM, messagesTotal = 100, messagesUnread = 15),
            Folder(id = "SENT", name = "送信済み", type = FolderType.SYSTEM, messagesTotal = 50, messagesUnread = 0),
            Folder(id = "MyFolder", name = "MyFolder", type = FolderType.USER, messagesTotal = 10, messagesUnread = 2),
        )
        given(getFolderListUseCase.execute()).willReturn(mockFolders)

        mockMvc.perform(get("/api/v1/folders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.folders").isArray())
            .andExpect(jsonPath("$.folders.length()").value(3))
            .andExpect(jsonPath("$.folders[0].id").value("INBOX"))
            .andExpect(jsonPath("$.folders[0].name").value("受信トレイ"))
            .andExpect(jsonPath("$.folders[0].type").value("system"))
            .andExpect(jsonPath("$.folders[0].messagesTotal").value(100))
            .andExpect(jsonPath("$.folders[0].messagesUnread").value(15))
            .andExpect(jsonPath("$.folders[1].id").value("SENT"))
            .andExpect(jsonPath("$.folders[1].type").value("system"))
            .andExpect(jsonPath("$.folders[2].id").value("MyFolder"))
            .andExpect(jsonPath("$.folders[2].type").value("user"))
    }

    @Test
    fun `GET api v1 folders はフォルダが空の場合に空配列を返す`() {
        given(getFolderListUseCase.execute()).willReturn(emptyList())

        mockMvc.perform(get("/api/v1/folders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.folders").isArray())
            .andExpect(jsonPath("$.folders.length()").value(0))
    }
}
