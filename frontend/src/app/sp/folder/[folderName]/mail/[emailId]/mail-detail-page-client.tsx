'use client';

import { useState } from 'react';
import { Header, BottomNavigation } from '@/components';
import { MailDetail as MailDetailComponent } from '@/features/emails';
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

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">メールが見つかりません</p>
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
    setEmail((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : prev));
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
