'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { useMarkReadMutation } from '@/features/emails/hooks/use-mark-read-mutation';
import {
  adjustFolder,
  countAffectedRead,
  setReadInPages,
} from '@/features/emails/utils/cache-helpers';
import { queryKeys } from '@/lib/query-keys';
import { type MailDetail, type MailFolder, type MailItem } from '@/types/mail';

const INITIAL_LIMIT = 100;

// The backend marks a mail as read (IMAP \Seen) as a side effect of fetching
// its detail, so a fresh detail response always has isRead: true. Opening a
// mail therefore only needs the client caches (mail list, folder unread count)
// synced locally — no extra server round-trip. The exception is a detail served
// from cache with isRead: false (e.g. reopened right after "mark as unread"):
// no GET reached the server, so an explicit mark-read request is required.
export function useMarkReadOnOpen(
  folderId: string,
  mailId: string,
  mail: MailDetail | null | undefined,
) {
  const qc = useQueryClient();
  const markReadMutation = useMarkReadMutation();
  const handledIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!mail || handledIdRef.current === mailId) return;
    handledIdRef.current = mailId;

    if (!mail.isRead) {
      markReadMutation.mutate({ folderId, mailIds: [mailId], isRead: true });
      return;
    }

    const listKey = queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT);
    const idSet = new Set([mailId]);
    const delta = countAffectedRead(
      qc.getQueryData<InfiniteData<MailItem[], number>>(listKey),
      idSet,
      true,
    );
    if (delta === 0) return;

    qc.setQueryData(
      listKey,
      (data: InfiniteData<MailItem[], number> | undefined) =>
        setReadInPages(data, idSet, true),
    );
    qc.setQueryData(queryKeys.folders(), (folders: MailFolder[] | undefined) =>
      adjustFolder(folders, folderId, (f) => ({
        ...f,
        messagesUnread: Math.max(0, f.messagesUnread - delta),
      })),
    );
  }, [mail, folderId, mailId, qc, markReadMutation]);
}
