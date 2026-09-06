export const queryKeys = {
  folders: () => ['folders'] as const,
  mailsInFolder: (folderId: string) => ['folders', folderId, 'mails'] as const,
  mailsInFolderInfinite: (folderId: string, limit: number) =>
    ['folders', folderId, 'mails', 'infinite', { limit }] as const,
  mailDetail: (folderId: string, mailId: string) =>
    ['folders', folderId, 'mails', mailId] as const,
};
