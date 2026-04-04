'use client';

import { useEffect, startTransition } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailDetail as MailDetailComponent } from '@/features/emails';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
import { useMailStarStore } from '@/features/emails/store/mail-star-store';
import { type MailDetail } from '@/types/mail';

type MailDetailPageClientProps = {
  folderId: string;
  emailId: string;
  email: MailDetail | null;
};

export function MailDetailPageClient({
  folderId,
  emailId,
  email: initialEmail,
}: MailDetailPageClientProps) {
  const { starredMap, initStars, toggleStar, setStar } = useMailStarStore();

  useEffect(() => {
    if (initialEmail) initStars([initialEmail]);
  }, [initialEmail, initStars]);

  if (!initialEmail) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">メールが見つかりません</p>
      </div>
    );
  }

  const email = {
    ...initialEmail,
    isStarred: starredMap[emailId] ?? initialEmail.isStarred,
  };

  const handleReplyClick = () => {
    console.log('Reply clicked for email:', emailId);
  };

  const handleForwardClick = () => {
    console.log('Forward clicked for email:', emailId);
  };

  const handleDeleteClick = () => {
    console.log('Delete clicked for email:', emailId);
  };

  const handleStarToggle = () => {
    toggleStar(emailId);
    startTransition(async () => {
      const { isStarred } = await toggleFlag(folderId, emailId);
      setStar(emailId, isStarred);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={email.subject}
        showBackButton={true}
        backPath={`/sp/folder/${encodeURIComponent(folderId)}`}
      />

      <MailDetailComponent
        email={email}
        onReplyClick={handleReplyClick}
        onForwardClick={handleForwardClick}
        onDeleteClick={handleDeleteClick}
        onStarToggle={handleStarToggle}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
