import MailItem from '@/features/emails/components/mail-item';
import { Card } from '@/components/ui/card';
import { type MailItem as MailItemType } from '@/types/mail';

type MailListProps = {
  emails: MailItemType[];
  folderId: string;
  onStarClick?: (emailId: string) => void;
};

export default function MailList({
  emails,
  folderId,
  onStarClick,
}: MailListProps) {
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
          />
        ))}
      </Card>
    </div>
  );
}
