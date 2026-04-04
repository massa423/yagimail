package com.example.yagimail.gateways

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.model.MailDetail
import com.example.yagimail.domain.model.MailItem
import jakarta.mail.*
import jakarta.mail.UIDFolder
import jakarta.mail.internet.MimeMultipart
import jakarta.mail.internet.MimeUtility
import java.io.InputStream
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.text.SimpleDateFormat
import java.util.*

@Component
class ImapMailGateway(
    @Value($$"${mail.imap.host}") private val host: String,
    @Value($$"${mail.imap.port}") private val port: Int,
    @Value($$"${mail.imap.username}") private val username: String,
    @Value($$"${mail.imap.password}") private val password: String,
    @Value($$"${mail.imap.protocol}") private val protocol: String,
    @Value($$"${mail.imap.trash}") private val trashFolderName: String,
) : MailGateway {
    private val logger = LoggerFactory.getLogger(ImapMailGateway::class.java)
    private val dateFormat = SimpleDateFormat("yyyy/MM/dd HH:mm")

    override fun getMailList(folderId: String): List<MailItem> {
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

            val inbox = store.getFolder(folderId)
            inbox.open(Folder.READ_ONLY)

            val messageCount = inbox.messageCount

            // 最新20件のみ取得
            val fetchLimit = 20
            val messages = if (messageCount > 0) {
                val start = maxOf(1, messageCount - fetchLimit + 1)
                inbox.getMessages(start, messageCount)
            } else {
                emptyArray()
            }

            // FetchProfileで必要な情報を一括取得（高速化）
            if (messages.isNotEmpty()) {
                val fetchProfile = FetchProfile().apply {
                    add(FetchProfile.Item.ENVELOPE)  // 送信者、件名、日付
                    add(FetchProfile.Item.FLAGS)     // 既読、スターなどのフラグ
                }
                inbox.fetch(messages, fetchProfile)
            }

            val mailItems = messages.mapIndexed { index, message ->
                val uid = try {
                    if (inbox is UIDFolder) {
                        inbox.getUID(message)
                    } else {
                        (index + 1).toLong()
                    }
                } catch (e: Exception) {
                    logger.info("UIDが見つからなかったためindexを利用します: ${e.message}", e)
                    (index + 1).toLong()
                }
                convertToMailItem(message, uid)
            }.reversed() // 新しいメールを先頭に

            inbox.close(false)
            store.close()

            mailItems
        } catch (e: Exception) {
            logger.error("エラーが発生しました: ${e.message}", e)
            e.printStackTrace()
            emptyList()
        }
    }

    override fun toggleFlag(folderId: String, mailId: String): Boolean {
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

            val folder = store.getFolder(folderId)
            folder.open(Folder.READ_WRITE)

            val message = if (folder is UIDFolder) {
                folder.getMessageByUID(mailId.toLong())
            } else {
                null
            } ?: run {
                folder.close(false)
                store.close()
                throw NoSuchElementException("Mail not found: $mailId")
            }

            val isCurrentlyFlagged = message.flags.contains(Flags.Flag.FLAGGED)
            message.setFlag(Flags.Flag.FLAGGED, !isCurrentlyFlagged)

            folder.close(false)
            store.close()

            !isCurrentlyFlagged
        } catch (e: NoSuchElementException) {
            throw e
        } catch (e: Exception) {
            logger.error("フラグ切り替え中にエラーが発生しました: ${e.message}", e)
            throw e
        }
    }

    override fun getMail(folderId: String, mailId: String): MailDetail? {
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

            val folder = store.getFolder(folderId)
            folder.open(Folder.READ_WRITE)

            val message = if (folder is UIDFolder) {
                folder.getMessageByUID(mailId.toLong())
            } else {
                null
            }

            if (message == null) {
                folder.close(false)
                store.close()
                return null
            }

            val uid = if (folder is UIDFolder) folder.getUID(message) else mailId.toLong()
            val detail = convertToMailDetail(message, uid, folder)

            // 本文 fetch 後に既読化
            message.setFlag(Flags.Flag.SEEN, true)

            folder.close(false)
            store.close()

            detail
        } catch (e: Exception) {
            logger.error("メール取得中にエラーが発生しました: ${e.message}", e)
            null
        }
    }

    private fun convertToMailDetail(message: Message, uid: Long, folder: Folder): MailDetail {
        val from = message.from?.firstOrNull()?.toString() ?: "Unknown"
        val to = message.getRecipients(Message.RecipientType.TO)
            ?.map { extractDisplayName(MimeUtility.decodeText(it.toString())) } ?: emptyList()
        val cc = message.getRecipients(Message.RecipientType.CC)
            ?.map { extractDisplayName(MimeUtility.decodeText(it.toString())) } ?: emptyList()

        val rawSubject = message.subject ?: "(No Subject)"
        val subject = try { MimeUtility.decodeText(rawSubject) } catch (e: Exception) { rawSubject }

        val receivedDate = message.receivedDate?.let { dateFormat.format(it) } ?: ""
        val flags = message.flags
        val isStarred = flags.contains(Flags.Flag.FLAGGED)

        val (bodyText, bodyHtml) = extractBody(message)

        return MailDetail(
            id = uid.toString(),
            subject = subject,
            from = extractDisplayName(MimeUtility.decodeText(from)),
            to = to,
            cc = cc,
            receivedDate = receivedDate,
            isStarred = isStarred,
            isRead = true, // 取得後に既読化するため常に true
            bodyText = bodyText,
            bodyHtml = bodyHtml,
        )
    }

    private fun extractBody(part: Part): Pair<String?, String?> {
        return when {
            part.isMimeType("text/plain") -> Pair(partContentAsString(part), null)
            part.isMimeType("text/html") -> Pair(null, partContentAsString(part))
            part.isMimeType("multipart/*") -> {
                val mp = part.content as MimeMultipart
                var text: String? = null
                var html: String? = null
                for (i in 0 until mp.count) {
                    val (t, h) = extractBody(mp.getBodyPart(i))
                    if (t != null) text = t
                    if (h != null) html = h
                }
                Pair(text, html)
            }
            else -> Pair(null, null)
        }
    }

    private fun partContentAsString(part: Part): String? {
        return try {
            when (val content = part.content) {
                is String -> content
                is InputStream -> content.bufferedReader().readText()
                else -> null
            }
        } catch (e: Exception) {
            logger.warn("本文の読み取りに失敗しました: ${e.message}")
            null
        }
    }

    private fun convertToMailItem(message: Message, uid: Long): MailItem {
        val from = message.from?.firstOrNull()?.toString() ?: "Unknown"
        val displayName = extractDisplayName(from)

        // 件名もMIMEデコード
        val rawSubject = message.subject ?: "(No Subject)"
        val subject = try {
            jakarta.mail.internet.MimeUtility.decodeText(rawSubject)
        } catch (e: Exception) {
            rawSubject
        }

        val receivedDate = message.receivedDate?.let { dateFormat.format(it) } ?: ""
        val flags = message.flags
        val isRead = flags.contains(Flags.Flag.SEEN)
        val isStarred = flags.contains(Flags.Flag.FLAGGED)

        val mailItem = MailItem(
            id = uid.toString(),
            displayName = displayName,
            subject = subject,
            receivedDate = receivedDate,
            isStarred = isStarred,
            isRead = isRead,
            senderIcon = "user"
        )

        return mailItem
    }

    override fun moveToTrash(folderId: String, mailId: String) {
        val properties = Properties().apply {
            put("mail.store.protocol", protocol)
            put("mail.${protocol}.host", host)
            put("mail.${protocol}.port", port.toString())
            put("mail.${protocol}.ssl.enable", "true")
            put("mail.${protocol}.ssl.trust", "*")
        }

        val session = Session.getInstance(properties)
        val store = session.getStore(protocol)

        try {
            store.connect(host, username, password)

            val folder = store.getFolder(folderId)
            folder.open(Folder.READ_WRITE)

            val message = if (folder is UIDFolder) {
                folder.getMessageByUID(mailId.toLong())
            } else {
                null
            } ?: run {
                folder.close(false)
                store.close()
                throw NoSuchElementException("Mail not found: $mailId")
            }

            val trashFolder = store.getFolder(trashFolderName)
            folder.copyMessages(arrayOf(message), trashFolder)
            message.setFlag(Flags.Flag.DELETED, true)

            folder.close(true) // expunge して完全削除
            store.close()
        } catch (e: NoSuchElementException) {
            throw e
        } catch (e: Exception) {
            logger.error("ゴミ箱への移動中にエラーが発生しました: ${e.message}", e)
            throw e
        }
    }

    private fun extractDisplayName(from: String): String {
        // MIMEエンコードされた文字列をデコード
        val decoded = try {
            jakarta.mail.internet.MimeUtility.decodeText(from)
        } catch (e: Exception) {
            from
        }

        // "Display Name <email@example.com>" の形式から Display Name を抽出
        val regex = Regex("^(.+?)\\s*<.+>$")
        val matchResult = regex.find(decoded)
        val result = matchResult?.groupValues?.get(1)?.trim() ?: decoded
        return result
    }
}
