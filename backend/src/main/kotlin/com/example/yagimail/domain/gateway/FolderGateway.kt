package com.example.yagimail.domain.gateway

import com.example.yagimail.domain.model.Folder

interface FolderGateway {
    fun getFolderList(): List<Folder>
}
