import MailItem from './MailItem';

interface MailListProps {
  emails: {
    id: string;
    displayName: string;
    subject: string;
    receivedDate: string;
    isStarred: boolean;
    isRead: boolean;
    senderIcon: string;
  }[];
  onMailClick?: (emailId: string) => void;
  onStarClick?: (emailId: string) => void;
}

export default function MailList({ emails, onMailClick, onStarClick }: MailListProps) {
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
            onClick={() => onMailClick?.(email.id)}
            onStarClick={() => onStarClick?.(email.id)}
            isLast={index === emails.length - 1}
          />
        ))}
      </div>
    </div>
  );
}