package com.example.yagimail.usecase

import com.example.yagimail.domain.gateway.FolderGateway
import com.example.yagimail.domain.model.Folder
import org.springframework.stereotype.Service

@Service
class GetFolderListUseCase(
    private val folderGateway: FolderGateway,
) {
    fun execute(): List<Folder> {
        return folderGateway.getFolderList()
    }
}
