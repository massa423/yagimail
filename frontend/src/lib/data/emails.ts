import { type MailItem } from '../../types/mail';

export type { MailItem };

export const emails: (MailItem & { content?: string })[] = [
  {
    id: '1',
    displayName: '山田太郎',
    subject: '来週の会議について',
    receivedDate: '2024/07/06 14:30',
    isStarred: true,
    isRead: false,
    senderIcon: 'user',
    content: `お疲れ様です。山田です。

来週の会議についてご連絡いたします。

【会議詳細】
日時：2024年7月15日（月）14:00-16:00
場所：第2会議室
議題：
・第3四半期の売上実績報告
・新プロダクトのローンチ計画
・マーケティング戦略の見直し

事前に資料をご確認いただき、ご質問やご意見がございましたらお聞かせください。

よろしくお願いいたします。`
  },
  {
    id: '2',
    displayName: '田中花子',
    subject: 'プロジェクト進捗報告',
    receivedDate: '2024/07/06 13:15',
    isStarred: false,
    isRead: true,
    senderIcon: 'user',
    content: `お疲れ様です。田中です。

プロジェクトの進捗についてご報告いたします。

【進捗状況】
・要件定義：完了（100%）
・設計フェーズ：90%完了
・開発フェーズ：30%完了

現在のところ、スケジュール通りに進んでおります。
次週からテストフェーズに移行予定です。

ご質問やご確認事項がございましたら、お気軽にお声がけください。

よろしくお願いいたします。`
  },
  {
    id: '3',
    displayName: '佐藤次郎',
    subject: '資料の送付について',
    receivedDate: '2024/07/06 11:45',
    isStarred: true,
    isRead: false,
    senderIcon: 'user',
    content: `お疲れ様です。佐藤です。

先日お話しした資料をお送りいたします。

【送付資料】
・市場調査レポート（PDF）
・競合他社分析資料（Excel）
・提案書（PowerPoint）

資料をご確認いただき、ご質問やご不明な点がございましたら、いつでもお声がけください。

来週打ち合わせの際に詳細をご説明させていただきます。

よろしくお願いいたします。`
  },
  {
    id: '4',
    displayName: '鈴木一郎',
    subject: '明日の打ち合わせ時間変更のお知らせ',
    receivedDate: '2024/07/06 10:20',
    isStarred: false,
    isRead: true,
    senderIcon: 'user',
    content: `お疲れ様です。鈴木です。

急なご連絡で申し訳ございません。

明日の打ち合わせの時間を変更させていただきたく、ご連絡いたします。

【変更前】14:00-15:00
【変更後】16:00-17:00

会議室は変更ございません（第3会議室）。

ご都合が悪い場合は、別日程での調整も可能です。
お忙しい中恐れ入りますが、ご確認のほどよろしくお願いいたします。`
  },
  {
    id: '5',
    displayName: '高橋美咲',
    subject: 'お疲れ様でした',
    receivedDate: '2024/07/05 18:30',
    isStarred: false,
    isRead: true,
    senderIcon: 'user',
    content: `お疲れ様です。高橋です。

本日はお忙しい中、貴重なお時間をいただきありがとうございました。

プレゼンテーションでいただいたフィードバックを踏まえ、資料の修正を行います。
来週までに修正版をお送りいたしますので、ご確認のほどよろしくお願いいたします。

また、今後ともどうぞよろしくお願いいたします。

ありがとうございました。`
  }
];