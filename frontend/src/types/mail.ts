export interface MailItem {
  id: string;
  displayName: string;
  subject: string;
  receivedDate: string;
  isStarred: boolean;
  isRead: boolean;
  senderIcon: string;
}

export interface MailFolder {
  id: string;
  name: string;
  unreadCount: number;
  icon: string;
}