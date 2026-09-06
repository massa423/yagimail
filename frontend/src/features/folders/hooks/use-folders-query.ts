'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFolders } from '@/features/folders/api/fetch-folders';
import { queryKeys } from '@/lib/query-keys';

export function useFoldersQuery() {
  return useQuery({
    queryKey: queryKeys.folders(),
    queryFn: fetchFolders,
  });
}
