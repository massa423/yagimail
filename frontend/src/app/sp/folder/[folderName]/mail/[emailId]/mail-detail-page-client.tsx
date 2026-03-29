'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailDetail as MailDetailComponent } from '@/features/emails';
import { toggleFlag } from '@/features/emails/actions/toggle-flag';
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
  const [email, setEmail] = useState(initialEmail);
  const [optimisticEmail, toggleOptimisticStar] = useOptimistic<
    MailDetail | null,
    undefined
  >(email, (state) =>
    state ? { ...state, isStarred: !state.isStarred } : state,
  );
  const [, startTransition] = useTransition();

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">メールが見つかりません</p>
      </div>
    );
  }

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
    startTransition(async () => {
      toggleOptimisticStar(undefined);
      const { isStarred } = await toggleFlag(folderId, emailId);
      setEmail((prev) => (prev ? { ...prev, isStarred } : prev));
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
        email={optimisticEmail ?? email}
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
