'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { moveToTrash } from '@/features/emails/actions/move-to-trash';
import {
  adjustFolder,
  countUnreadIn,
  removeFromPages,
} from '@/features/emails/utils/cache-helpers';
import { queryKeys } from '@/lib/query-keys';
import { type MailFolder, type MailItem } from '@/types/mail';
import { type InfiniteData } from '@tanstack/react-query';

const INITIAL_LIMIT = 100;

type Vars = { folderId: string; mailIds: string[] };
type Ctx = {
  prevList: InfiniteData<MailItem[], number> | undefined;
  prevFolders: MailFolder[] | undefined;
};

export function useMoveToTrashMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, Vars, Ctx>({
    mutationFn: ({ folderId, mailIds }) => moveToTrash(folderId, mailIds),
    onMutate: async ({ folderId, mailIds }) => {
      await qc.cancelQueries({ queryKey: queryKeys.mailsInFolder(folderId) });
      await qc.cancelQueries({ queryKey: queryKeys.folders() });

      const listKey = queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT);
      const foldersKey = queryKeys.folders();
      const idSet = new Set(mailIds);

      const prevList =
        qc.getQueryData<InfiniteData<MailItem[], number>>(listKey);
      const prevFolders = qc.getQueryData<MailFolder[]>(foldersKey);

      const unreadDelta = countUnreadIn(prevList, idSet);
      const totalDelta = mailIds.length;

      qc.setQueryData(
        listKey,
        (data: InfiniteData<MailItem[], number> | undefined) =>
          removeFromPages(data, idSet),
      );
      qc.setQueryData(foldersKey, (folders: MailFolder[] | undefined) =>
        adjustFolder(folders, folderId, (f) => ({
          ...f,
          messagesTotal: Math.max(0, f.messagesTotal - totalDelta),
          messagesUnread: Math.max(0, f.messagesUnread - unreadDelta),
        })),
      );

      return { prevList, prevFolders };
    },
    onError: (_err, { folderId }, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT),
        ctx.prevList,
      );
      qc.setQueryData(queryKeys.folders(), ctx.prevFolders);
      toast.error('削除に失敗しました');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: queryKeys.folders() });
    },
  });
}
