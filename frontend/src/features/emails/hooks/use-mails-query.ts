'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchMails } from '@/features/emails/api/fetch-mails';
import { queryKeys } from '@/lib/query-keys';

const DEFAULT_LIMIT = 100;

export function useMailsQuery(folderId: string, limit: number = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: queryKeys.mailsInFolderInfinite(folderId, limit),
    queryFn: ({ pageParam }) =>
      fetchMails(folderId, { limit, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < limit
        ? undefined
        : allPages.reduce((sum, p) => sum + p.length, 0),
  });
}
