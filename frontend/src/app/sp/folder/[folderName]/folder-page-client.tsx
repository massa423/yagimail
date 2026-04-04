'use client';

import { useEffect, startTransition } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
import { useMailStarStore } from '@/features/emails/store/mail-star-store';
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

  useEffect(() => {
    initStars(initialEmails);
  }, [initialEmails, initStars]);

  const handleStarClick = (emailId: string) => {
    toggleStar(emailId);
    startTransition(async () => {
      const { isStarred } = await toggleFlag(folderId, emailId);
      setStar(emailId, isStarred);
    });
  };

  const emails = initialEmails.map((email) => ({
    ...email,
    isStarred: starredMap[email.id] ?? email.isStarred,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header title={folderId} showBackButton={true} backPath="/sp" />

      <MailList
        emails={emails}
        folderId={folderId}
        onStarClick={handleStarClick}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
