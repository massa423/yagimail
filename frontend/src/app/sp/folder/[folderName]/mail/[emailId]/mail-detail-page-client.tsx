'use client';

import { Header, BottomNavigation } from '@/components';
import { MailDetail as MailDetailComponent } from '@/features/emails';
import { useMailDetailQuery } from '@/features/emails/hooks/use-mail-detail-query';
import { useMarkReadOnOpen } from '@/features/emails/hooks/use-mark-read-on-open';
import { useToggleFlagMutation } from '@/features/emails/hooks/use-toggle-flag-mutation';

type MailDetailPageClientProps = {
  folderId: string;
  emailId: string;
};

export function MailDetailPageClient({
  folderId,
  emailId,
}: MailDetailPageClientProps) {
  const { data: email, isPending } = useMailDetailQuery(folderId, emailId);
  const toggleFlagMutation = useToggleFlagMutation();
  useMarkReadOnOpen(folderId, emailId, email);

  if (isPending) {
    return null;
  }

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
    toggleFlagMutation.mutate({ folderId, mailId: emailId });
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
