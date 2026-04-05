'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import MailItem from '@/features/emails/components/mail-item';
import { Card } from '@/components/ui/card';
import { type MailItem as MailItemType } from '@/types/mail';

type MailListProps = {
  emails: MailItemType[];
  folderId: string;
  onStarClick?: (emailId: string) => void;
  selectedIds?: Set<string>;
  onSelect?: (emailId: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
};

export default function MailList({
  emails,
  folderId,
  onStarClick,
  selectedIds,
  onSelect,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: MailListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onLoadMore || !hasMore) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore]);

  if (emails.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">メールがありません</p>
      </div>
    );
  }

  return (
    <div className="p-3">
      <Card className="gap-0 py-0">
        {emails.map((email, index) => (
          <MailItem
            key={email.id}
            mail={email}
            onStarClick={() => onStarClick?.(email.id)}
            isLast={index === emails.length - 1}
            href={`/sp/folder/${encodeURIComponent(folderId)}/mail/${email.id}`}
            isSelected={selectedIds?.has(email.id) ?? false}
            onSelect={() => onSelect?.(email.id)}
          />
        ))}
      </Card>

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      )}

      <div ref={sentinelRef} className="h-1" />
    </div>
  );
}
