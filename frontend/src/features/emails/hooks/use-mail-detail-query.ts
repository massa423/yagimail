'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchMailDetail } from '@/features/emails/api/fetch-mail-detail';
import { queryKeys } from '@/lib/query-keys';

export function useMailDetailQuery(folderId: string, mailId: string) {
  return useQuery({
    queryKey: queryKeys.mailDetail(folderId, mailId),
    queryFn: () => fetchMailDetail(folderId, mailId),
  });
}
