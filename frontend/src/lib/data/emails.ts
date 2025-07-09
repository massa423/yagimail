import { type MailItem } from '../../types/mail';

export type { MailItem };

export const emails: MailItem[] = [
  {
    id: '1',
    displayName: '山田太郎',
    subject: '来週の会議について',
    receivedDate: '2024/07/06 14:30',
    isStarred: true,
    isRead: false,
    senderIcon: 'user'
  },
  {
    id: '2',
    displayName: '田中花子',
    subject: 'プロジェクト進捗報告',
    receivedDate: '2024/07/06 13:15',
    isStarred: false,
    isRead: true,
    senderIcon: 'user'
  },
  {
    id: '3',
    displayName: '佐藤次郎',
    subject: '資料の送付について',
    receivedDate: '2024/07/06 11:45',
    isStarred: true,
    isRead: false,
    senderIcon: 'user'
  },
  {
    id: '4',
    displayName: '鈴木一郎',
    subject: '明日の打ち合わせ時間変更のお知らせ',
    receivedDate: '2024/07/06 10:20',
    isStarred: false,
    isRead: true,
    senderIcon: 'user'
  },
  {
    id: '5',
    displayName: '高橋美咲',
    subject: 'お疲れ様でした',
    receivedDate: '2024/07/05 18:30',
    isStarred: false,
    isRead: true,
    senderIcon: 'user'
  }
];