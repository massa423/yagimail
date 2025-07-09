import { type MailFolder } from '../../types/mail';

export type { MailFolder };

export const folders: MailFolder[] = [
  { id: '1', name: '受信トレイ', unreadCount: 15, icon: 'inbox' },
  { id: '2', name: '送信済み', unreadCount: 0, icon: 'sent' },
  { id: '3', name: '下書き', unreadCount: 3, icon: 'draft' },
  { id: '4', name: 'ゴミ箱', unreadCount: 0, icon: 'trash' },
  { id: '5', name: 'スパム', unreadCount: 7, icon: 'spam' },
  { id: '6', name: '重要', unreadCount: 2, icon: 'star' },
  { id: '7', name: 'アーカイブ', unreadCount: 0, icon: 'archive' },
];