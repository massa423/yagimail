import { MailOpen, Mail, Trash2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';

type MailActionBarProps = {
  selectedCount: number;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onMoveToTrash: () => void;
  onReport: () => void;
};

export default function MailActionBar({
  selectedCount: _selectedCount,
  onMarkRead,
  onMarkUnread,
  onMoveToTrash,
  onReport,
}: MailActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg">
      <div className="flex items-center justify-around p-2">
        <Button
          variant="ghost"
          size="icon-sm"
          className="flex flex-col gap-1 h-auto py-2 px-3"
          onClick={onMarkRead}
          aria-label="既読にする"
        >
          <MailOpen className="w-5 h-5" />
          <span className="text-[10px]">既読</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="flex flex-col gap-1 h-auto py-2 px-3"
          onClick={onMarkUnread}
          aria-label="未読にする"
        >
          <Mail className="w-5 h-5" />
          <span className="text-[10px]">未読</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="flex flex-col gap-1 h-auto py-2 px-3 text-destructive hover:text-destructive"
          onClick={onMoveToTrash}
          aria-label="削除"
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px]">削除</span>
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          className="flex flex-col gap-1 h-auto py-2 px-3"
          onClick={onReport}
          aria-label="通報"
        >
          <Flag className="w-5 h-5" />
          <span className="text-[10px]">通報</span>
        </Button>
      </div>
    </div>
  );
}
