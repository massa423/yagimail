'use client';

import { useState } from 'react';
import { CheckSquare, Square, MinusSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import MailActionBar from '@/features/emails/components/mail-action-bar';
import { useMailsQuery } from '@/features/emails/hooks/use-mails-query';
import { useToggleFlagMutation } from '@/features/emails/hooks/use-toggle-flag-mutation';
import { useMarkReadMutation } from '@/features/emails/hooks/use-mark-read-mutation';
import { useMoveToTrashMutation } from '@/features/emails/hooks/use-move-to-trash-mutation';

type FolderPageClientProps = {
  folderId: string;
};

export function FolderPageClient({ folderId }: FolderPageClientProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useMailsQuery(folderId);
  const emails = data?.pages.flat() ?? [];

  const toggleFlagMutation = useToggleFlagMutation();
  const markReadMutation = useMarkReadMutation();
  const moveToTrashMutation = useMoveToTrashMutation();

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleSelect = (emailId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(emailId)) {
        next.delete(emailId);
      } else {
        next.add(emailId);
      }
      return next;
    });
  };

  const handleStarClick = (emailId: string) => {
    toggleFlagMutation.mutate({ folderId, mailId: emailId });
  };

  const handleMarkRead = () => {
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set());
    markReadMutation.mutate({ folderId, mailIds: ids, isRead: true });
  };

  const handleMarkUnread = () => {
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set());
    markReadMutation.mutate({ folderId, mailIds: ids, isRead: false });
  };

  const handleMoveToTrash = () => {
    const ids = Array.from(selectedIds);
    setSelectedIds(new Set());
    moveToTrashMutation.mutate({ folderId, mailIds: ids });
  };

  const handleSelectAll = () => {
    const allIds = emails.map((e) => e.id);
    const allLoadedSelected =
      allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allLoadedSelected ? new Set() : new Set(allIds));
  };

  const handleReport = () => {
    setSelectedIds(new Set());
    toast('通報しました');
  };

  if (isPending) {
    return null;
  }

  const selectedCount = selectedIds.size;
  const allSelected = selectedCount > 0 && selectedCount === emails.length;
  const someSelected = selectedCount > 0 && selectedCount < emails.length;

  const selectAllBar = (
    <div className="border-t">
      <button
        className="flex items-center gap-2 px-4 py-2 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        onClick={handleSelectAll}
        aria-label={allSelected ? '全て選択解除' : '全て選択'}
      >
        {allSelected ? (
          <CheckSquare className="w-5 h-5 text-primary" />
        ) : someSelected ? (
          <MinusSquare className="w-5 h-5 text-primary" />
        ) : (
          <Square className="w-5 h-5" />
        )}
        <span>{allSelected ? '全て選択解除' : '全て選択'}</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={selectedCount > 0 ? `${selectedCount}件選択中` : folderId}
        showBackButton={true}
        backPath="/sp"
        bottomContent={selectAllBar}
      />

      <MailList
        emails={emails}
        folderId={folderId}
        onStarClick={handleStarClick}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onLoadMore={loadMore}
        hasMore={hasNextPage}
        isLoadingMore={isFetchingNextPage}
      />

      {selectedIds.size === 0 && <BottomNavigation />}

      {selectedIds.size > 0 && (
        <MailActionBar
          selectedCount={selectedIds.size}
          onMarkRead={handleMarkRead}
          onMarkUnread={handleMarkUnread}
          onMoveToTrash={handleMoveToTrash}
          onReport={handleReport}
        />
      )}

      <div className="h-16"></div>
    </div>
  );
}
