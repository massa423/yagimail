'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendMail } from '@/features/emails/actions/send-mail';
import { type SendMailPayload } from '@/features/emails/schemas/send-mail-schema';
import { queryKeys } from '@/lib/query-keys';

export function useSendMailMutation() {
  const qc = useQueryClient();

  return useMutation<void, Error, SendMailPayload>({
    mutationFn: (payload) => sendMail(payload),
    onSuccess: () => {
      toast.success('送信しました');
      // 送信済みフォルダの件数・一覧を最新化する (prefix 一致で配下も無効化)
      qc.invalidateQueries({ queryKey: queryKeys.folders() });
    },
    onError: () => {
      toast.error('送信に失敗しました');
    },
  });
}
