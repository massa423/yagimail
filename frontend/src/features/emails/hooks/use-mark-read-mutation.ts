'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { markRead } from '@/features/emails/actions/mark-read';
import { markUnread } from '@/features/emails/actions/mark-unread';
import {
  adjustFolder,
  countAffectedRead,
  setReadInPages,
} from '@/features/emails/utils/cache-helpers';
import { queryKeys } from '@/lib/query-keys';
import { type MailDetail, type MailFolder, type MailItem } from '@/types/mail';
import { type InfiniteData } from '@tanstack/react-query';

const INITIAL_LIMIT = 100;

type Vars = { folderId: string; mailIds: string[]; isRead: boolean };
type Ctx = {
  prevList: InfiniteData<MailItem[], number> | undefined;
  prevFolders: MailFolder[] | undefined;
  prevDetails: Map<string, MailDetail | null | undefined>;
};

export function useMarkReadMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, Vars, Ctx>({
    mutationFn: ({ folderId, mailIds, isRead }) =>
      isRead ? markRead(folderId, mailIds) : markUnread(folderId, mailIds),
    onMutate: async ({ folderId, mailIds, isRead }) => {
      await qc.cancelQueries({ queryKey: queryKeys.mailsInFolder(folderId) });
      await qc.cancelQueries({ queryKey: queryKeys.folders() });

      const listKey = queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT);
      const foldersKey = queryKeys.folders();
      const idSet = new Set(mailIds);

      const prevList =
        qc.getQueryData<InfiniteData<MailItem[], number>>(listKey);
      const prevFolders = qc.getQueryData<MailFolder[]>(foldersKey);

      const delta = countAffectedRead(prevList, idSet, isRead);
      qc.setQueryData(
        listKey,
        (data: InfiniteData<MailItem[], number> | undefined) =>
          setReadInPages(data, idSet, isRead),
      );
      if (delta !== 0) {
        qc.setQueryData(foldersKey, (folders: MailFolder[] | undefined) =>
          adjustFolder(folders, folderId, (f) => ({
            ...f,
            messagesUnread: Math.max(
              0,
              f.messagesUnread + (isRead ? -delta : +delta),
            ),
          })),
        );
      }

      const prevDetails = new Map<string, MailDetail | null | undefined>();
      for (const id of mailIds) {
        const detailKey = queryKeys.mailDetail(folderId, id);
        prevDetails.set(id, qc.getQueryData<MailDetail | null>(detailKey));
        qc.setQueryData(detailKey, (d: MailDetail | null | undefined) =>
          d ? { ...d, isRead } : d,
        );
      }

      return { prevList, prevFolders, prevDetails };
    },
    onError: (_err, { folderId, isRead }, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT),
        ctx.prevList,
      );
      qc.setQueryData(queryKeys.folders(), ctx.prevFolders);
      for (const [id, prev] of ctx.prevDetails) {
        qc.setQueryData(queryKeys.mailDetail(folderId, id), prev);
      }
      toast.error(
        isRead ? '既読への変更に失敗しました' : '未読への変更に失敗しました',
      );
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.folders() });
    },
  });
}
