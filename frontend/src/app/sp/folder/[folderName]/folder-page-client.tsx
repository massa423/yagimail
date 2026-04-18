'use client';

import { useEffect, startTransition, useState } from 'react';
import { CheckSquare, Square, MinusSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import MailActionBar from '@/features/emails/components/mail-action-bar';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
import { markRead } from '@/features/emails/actions/mark-read';
import { markUnread } from '@/features/emails/actions/mark-unread';
import { moveToTrash } from '@/features/emails/actions/move-to-trash';
import { useMailStarStore } from '@/features/emails/store/mail-star-store';
import { useInfiniteMail } from '@/hooks/use-infinite-mail';
import { type MailItem } from '@/types/mail';

type FolderPageClientProps = {
  folderId: string;
  initialEmails: MailItem[];
};

export function FolderPageClient({
  folderId,
  initialEmails,
}: FolderPageClientProps) {
  const { starredMap, initStars, toggleStar, setStar } = useMailStarStore();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [readMap, setReadMap] = useState<Record<string, boolean>>({});
  const [trashedIds, setTrashedIds] = useState<Set<string>>(new Set());
  const { emails: rawEmails, loadMore, hasMore, isLoadingMore } = useInfiniteMail(folderId, initialEmails);

  useEffect(() => {
    initStars(rawEmails);
  }, [rawEmails, initStars]);

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
    toggleStar(emailId);
    startTransition(async () => {
      const { isStarred } = await toggleFlag(folderId, emailId);
      setStar(emailId, isStarred);
    });
  };

  const selectedIdsArray = Array.from(selectedIds);

  const handleMarkRead = () => {
    const ids = [...selectedIdsArray];
    const prevReadMap = { ...readMap };
    setReadMap((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = true));
      return next;
    });
    setSelectedIds(new Set());
    startTransition(async () => {
      try {
        await markRead(folderId, ids);
      } catch {
        setReadMap(prevReadMap);
        toast.error('既読への変更に失敗しました');
      }
    });
  };

  const handleMarkUnread = () => {
    const ids = [...selectedIdsArray];
    const prevReadMap = { ...readMap };
    setReadMap((prev) => {
      const next = { ...prev };
      ids.forEach((id) => (next[id] = false));
      return next;
    });
    setSelectedIds(new Set());
    startTransition(async () => {
      try {
        await markUnread(folderId, ids);
      } catch {
        setReadMap(prevReadMap);
        toast.error('未読への変更に失敗しました');
      }
    });
  };

  const handleMoveToTrash = () => {
    const ids = [...selectedIdsArray];
    setSelectedIds(new Set());
    startTransition(async () => {
      try {
        await moveToTrash(folderId, ids);
        setTrashedIds((prev) => new Set([...prev, ...ids]));
      } catch {
        toast.error('削除に失敗しました');
      }
    });
  };

  const handleSelectAll = () => {
    const allIds = emails.map((e) => e.id);
    const allLoadedSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
    setSelectedIds(allLoadedSelected ? new Set() : new Set(allIds));
  };

  const handleReport = () => {
    setSelectedIds(new Set());
    toast('通報しました');
  };

  const emails = rawEmails
    .filter((email) => !trashedIds.has(email.id))
    .map((email) => ({
      ...email,
      isStarred: starredMap[email.id] ?? email.isStarred,
      isRead: readMap[email.id] ?? email.isRead,
    }));

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
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
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
