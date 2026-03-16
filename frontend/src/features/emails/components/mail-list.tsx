import MailItem from '@/features/emails/components/mail-item';
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
        <p className="text-gray-500">メールがありません</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {emails.map((email, index) => (
          <MailItem
            key={email.id}
            mail={email}
            onStarClick={() => onStarClick?.(email.id)}
            isLast={index === emails.length - 1}
            href={`/sp/folder/${encodeURIComponent(folderId)}/mail/${email.id}`}
          />
        ))}
      </div>
    </div>
  );
}
