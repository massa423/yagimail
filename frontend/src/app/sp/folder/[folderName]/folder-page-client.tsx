'use client';

import { useState, useCallback } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
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

  const handleStarClick = useCallback((emailId: string) => {
    setEmails((prevEmails) =>
      prevEmails.map((email) =>
        email.id === emailId
          ? { ...email, isStarred: !email.isStarred }
          : email,
      ),
    );
  }, []);

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
