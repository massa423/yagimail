'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { type MailItem } from '@/types/mail';

async function fetchMoreMails(
  folderId: string,
  offset: number,
  limit: number,
): Promise<MailItem[]> {
  const res = await fetch(
    `/api/v1/folders/${encodeURIComponent(folderId)}/mails?limit=${limit}&offset=${offset}`,
  );
  if (!res.ok) {
    throw new Error('Failed to fetch emails');
  }
  return res.json();
}

export function useInfiniteMail(
  folderId: string,
  initialEmails: MailItem[],
  limit = 100,
) {
  const [emails, setEmails] = useState<MailItem[]>(initialEmails);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialEmails.length >= limit);
  const offsetRef = useRef(initialEmails.length);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(initialEmails.length >= limit);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMoreRef.current) return;
    isLoadingRef.current = true;
    setIsLoadingMore(true);
    try {
      const newMails = await fetchMoreMails(folderId, offsetRef.current, limit);
      if (newMails.length < limit) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
      if (newMails.length > 0) {
        offsetRef.current += newMails.length;
        setEmails((prev) => [...prev, ...newMails]);
      }
    } catch {
      toast.error('メールの読み込みに失敗しました');
    } finally {
      isLoadingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [folderId, limit]); // stable — guards use refs, not state

  return { emails, loadMore, hasMore, isLoadingMore };
}
