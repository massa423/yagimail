import {
  UserIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@/components/ui/icons/mail-icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

type MailItemProps = {
  mail: {
    id: string;
    displayName: string;
    subject: string;
    receivedDate: string;
    isStarred: boolean;
    isRead: boolean;
    senderIcon: string;
  };
  onStarClick?: () => void;
  isLast?: boolean;
  href: string;
  isSelected?: boolean;
  onSelect?: () => void;
};

export default function MailItem({
  mail,
  onStarClick,
  isLast,
  href,
  isSelected = false,
  onSelect,
}: MailItemProps) {
  const content = (
    <>
      <button
        className="mr-3 flex-shrink-0 focus:outline-none [perspective:200px]"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelect?.();
        }}
        aria-label={isSelected ? '選択解除' : '選択'}
        aria-checked={isSelected}
        role="checkbox"
      >
        <div
          className={`relative w-10 h-10 transition-transform duration-300 [transform-style:preserve-3d] ${isSelected ? '[transform:rotateY(180deg)]' : ''}`}
        >
          <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center">
            <Avatar size="lg">
              <AvatarFallback>
                <UserIcon className="w-5 h-5 text-primary" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
        </div>
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm truncate ${mail.isRead ? 'text-muted-foreground' : 'font-bold'}`}
          >
            {mail.displayName}
          </h3>
          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
            {mail.receivedDate}
          </span>
        </div>
        <p
          className={`text-sm mt-1 truncate ${mail.isRead ? 'text-muted-foreground' : 'font-semibold'}`}
        >
          {mail.subject}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="ml-2 flex-shrink-0"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStarClick?.();
        }}
      >
        {mail.isStarred ? (
          <StarFilledIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <StarOutlineIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </Button>
    </>
  );

  return (
    <div>
      <Link
        href={href}
        className={`flex items-center p-4 hover:bg-muted/50 active:bg-muted transition-colors ${isSelected ? 'bg-primary/10' : ''}`}
      >
        {content}
      </Link>
      {!isLast && <Separator className="ml-[68px]" />}
    </div>
  );
}
