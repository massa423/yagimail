'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
import {
  flipStarInPages,
  patchDetail,
  setStarInPages,
} from '@/features/emails/utils/cache-helpers';
import { queryKeys } from '@/lib/query-keys';
import { type MailDetail, type MailItem } from '@/types/mail';
import { type InfiniteData } from '@tanstack/react-query';

const INITIAL_LIMIT = 100;

type Vars = { folderId: string; mailId: string };
type Ctx = {
  prevList: InfiniteData<MailItem[], number> | undefined;
  prevDetail: MailDetail | null | undefined;
};

export function useToggleFlagMutation() {
  const qc = useQueryClient();

  return useMutation<{ isStarred: boolean }, Error, Vars, Ctx>({
    mutationFn: ({ folderId, mailId }) => toggleFlag(folderId, mailId),
    onMutate: async ({ folderId, mailId }) => {
      await qc.cancelQueries({ queryKey: queryKeys.mailsInFolder(folderId) });

      const listKey = queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT);
      const detailKey = queryKeys.mailDetail(folderId, mailId);

      const prevList =
        qc.getQueryData<InfiniteData<MailItem[], number>>(listKey);
      const prevDetail = qc.getQueryData<MailDetail | null>(detailKey);

      qc.setQueryData(
        listKey,
        (data: InfiniteData<MailItem[], number> | undefined) =>
          flipStarInPages(data, mailId),
      );
      qc.setQueryData(detailKey, (d: MailDetail | null | undefined) =>
        d ? patchDetail(d, { isStarred: !d.isStarred }) : d,
      );

      return { prevList, prevDetail };
    },
    onError: (_err, { folderId, mailId }, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT),
        ctx.prevList,
      );
      qc.setQueryData(queryKeys.mailDetail(folderId, mailId), ctx.prevDetail);
      toast.error('★の変更に失敗しました');
    },
    onSuccess: ({ isStarred }, { folderId, mailId }) => {
      qc.setQueryData(
        queryKeys.mailsInFolderInfinite(folderId, INITIAL_LIMIT),
        (data: InfiniteData<MailItem[], number> | undefined) =>
          setStarInPages(data, mailId, isStarred),
      );
      qc.setQueryData(
        queryKeys.mailDetail(folderId, mailId),
        (d: MailDetail | null | undefined) => patchDetail(d, { isStarred }),
      );
    },
  });
}
