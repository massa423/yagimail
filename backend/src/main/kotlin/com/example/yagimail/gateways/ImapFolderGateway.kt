package com.example.yagimail.gateways

import com.example.yagimail.domain.gateway.FolderGateway
import com.example.yagimail.domain.model.Folder
import com.example.yagimail.domain.model.FolderType
import jakarta.mail.Folder as MailFolder
import jakarta.mail.Session
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Properties

@Component
class ImapFolderGateway(
    @Value($$"${mail.imap.host}") private val host: String,
    @Value($$"${mail.imap.port}") private val port: Int,
    @Value($$"${mail.imap.username}") private val username: String,
    @Value($$"${mail.imap.password}") private val password: String,
    @Value($$"${mail.imap.protocol}") private val protocol: String,
) : FolderGateway {
    private val logger = LoggerFactory.getLogger(ImapFolderGateway::class.java)

    // IMAPフォルダ名（小文字）-> (正規化ID, 表示名) のマッピング
    // Gmail, Yahoo Mail, Outlook 等の主要プロバイダーの標準フォルダ名に対応
    private val systemFolderMap = mapOf(
        "inbox" to Pair("INBOX", "受信トレイ"),
        "sent" to Pair("SENT", "送信済み"),
        "sent mail" to Pair("SENT", "送信済み"),
        "sent items" to Pair("SENT", "送信済み"),
        "[gmail]/sent mail" to Pair("SENT", "送信済み"),
        "drafts" to Pair("DRAFT", "下書き"),
        "draft" to Pair("DRAFT", "下書き"),
        "[gmail]/drafts" to Pair("DRAFT", "下書き"),
        "trash" to Pair("TRASH", "ゴミ箱"),
        "deleted" to Pair("TRASH", "ゴミ箱"),
        "deleted items" to Pair("TRASH", "ゴミ箱"),
        "deleted messages" to Pair("TRASH", "ゴミ箱"),
        "[gmail]/trash" to Pair("TRASH", "ゴミ箱"),
        "spam" to Pair("SPAM", "スパム"),
        "junk" to Pair("SPAM", "スパム"),
        "junk e-mail" to Pair("SPAM", "スパム"),
        "junk mail" to Pair("SPAM", "スパム"),
        "bulk mail" to Pair("SPAM", "スパム"),
        "[gmail]/spam" to Pair("SPAM", "スパム"),
        "archive" to Pair("ARCHIVE", "アーカイブ"),
        "[gmail]/all mail" to Pair("ARCHIVE", "アーカイブ"),
    )

    // システムフォルダの表示順序
    private val systemFolderOrder = listOf("INBOX", "SENT", "DRAFT", "TRASH", "SPAM", "ARCHIVE")

    override fun getFolderList(): List<Folder> {
        val properties = Properties().apply {
            put("mail.store.protocol", protocol)
            put("mail.${protocol}.host", host)
            put("mail.${protocol}.port", port.toString())
            put("mail.${protocol}.ssl.enable", "true")
            put("mail.${protocol}.ssl.trust", "*")
        }

        val session = Session.getInstance(properties)
        val store = session.getStore(protocol)

        return try {
            store.connect(host, username, password)

            val allFolders = store.defaultFolder.list("*")

            val systemFolderMap = mutableMapOf<String, Folder>()
            val userFolders = mutableListOf<Folder>()

            for (mailFolder in allFolders) {
                // メッセージを保持できないフォルダ（サブフォルダコンテナ等）はスキップ
                if (mailFolder.type and MailFolder.HOLDS_MESSAGES == 0) continue

                val folderNameLower = mailFolder.fullName.lowercase()
                val systemInfo = this.systemFolderMap[folderNameLower]
                val type = if (systemInfo != null) FolderType.SYSTEM else FolderType.USER
                val id = mailFolder.fullName
                val name = systemInfo?.second ?: mailFolder.name

                val (messagesTotal, messagesUnread) = getMessageCounts(mailFolder)

                val folder = Folder(
                    id = id,
                    name = name,
                    type = type,
                    messagesTotal = messagesTotal,
                    messagesUnread = messagesUnread,
                )

                if (type == FolderType.SYSTEM) {
                    // 同じカテゴリのシステムフォルダが複数存在する場合は最初に見つかったものを使う
                    systemFolderMap.putIfAbsent(systemInfo!!.first, folder)
                } else {
                    userFolders.add(folder)
                }
            }

            store.close()

            // システムフォルダを定義済みの順序で並べ、続けてユーザーフォルダを追加
            val sortedSystemFolders = systemFolderOrder.mapNotNull { systemFolderMap[it] }
            sortedSystemFolders + userFolders
        } catch (e: Exception) {
            logger.error("フォルダ一覧取得中にエラーが発生しました: ${e.message}", e)
            emptyList()
        }
    }

    private fun getMessageCounts(folder: MailFolder): Pair<Int, Int> {
        return try {
            folder.open(MailFolder.READ_ONLY)
            val total = folder.messageCount
            val unread = folder.unreadMessageCount
            folder.close(false)
            Pair(total, unread)
        } catch (e: Exception) {
            logger.warn("フォルダ \"${folder.fullName}\" のメッセージ数取得に失敗しました: ${e.message}")
            Pair(0, 0)
        }
    }
}
