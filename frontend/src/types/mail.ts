export type FolderType = 'system' | 'user';

export type MailFolder = {
  id: string;
  name: string;
  type: FolderType;
  messagesTotal: number;
  messagesUnread: number;
};

export type MailItem = {
  id: string;
  displayName: string;
  subject: string;
  receivedDate: string;
  isStarred: boolean;
  isRead: boolean;
  senderIcon: string;
};

export type MailDetail = {
  id: string;
  subject: string;
  from: string;
  to: string[];
  cc: string[];
  receivedDate: string;
  isStarred: boolean;
  isRead: boolean;
  bodyText: string | null;
  bodyHtml: string | null;
};
