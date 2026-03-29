'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
import { type MailItem } from '@/types/mail';

type FolderPageClientProps = {
  folderId: string;
  initialEmails: MailItem[];
};

export function FolderPageClient({
  folderId,
  initialEmails,
}: FolderPageClientProps) {
  const [emails, setEmails] = useState<MailItem[]>(initialEmails);
  const [optimisticEmails, toggleOptimisticStar] = useOptimistic(
    emails,
    (state, emailId: string) =>
      state.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email,
      ),
  );
  const [, startTransition] = useTransition();

  const handleStarClick = (emailId: string) => {
    startTransition(async () => {
      toggleOptimisticStar(emailId);
      const { isStarred } = await toggleFlag(folderId, emailId);
      setEmails((prev) =>
        prev.map((email) =>
          email.id === emailId ? { ...email, isStarred } : email,
        ),
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title={folderId} showBackButton={true} backPath="/sp" />

      <MailList
        emails={optimisticEmails}
        folderId={folderId}
        onStarClick={handleStarClick}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
