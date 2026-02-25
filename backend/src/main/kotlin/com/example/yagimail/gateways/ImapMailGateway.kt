package com.example.yagimail.gateways

import com.example.yagimail.domain.gateway.MailGateway
import com.example.yagimail.domain.model.MailItem
import jakarta.mail.*
import jakarta.mail.UIDFolder
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
    @Value($$"${mail.imap.protocol}") private val protocol: String
) : MailGateway {
    private val logger = LoggerFactory.getLogger(ImapMailGateway::class.java)
    private val dateFormat = SimpleDateFormat("yyyy/MM/dd HH:mm")

    override fun getMailList(): List<MailItem> {
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

            val inbox = store.getFolder("INBOX")
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
