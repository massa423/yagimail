import {
  UserIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@/components/ui/icons/mail-icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type MailDetail } from '@/types/mail';
import { EmailHtmlRenderer } from './email-html-renderer';

type MailDetailProps = {
  email: MailDetail;
  onReplyClick?: () => void;
  onForwardClick?: () => void;
  onDeleteClick?: () => void;
  onStarToggle?: () => void;
};

export default function MailDetail({
  email,
  onReplyClick,
  onForwardClick,
  onDeleteClick,
  onStarToggle,
}: MailDetailProps) {
  return (
    <div className="flex-1 bg-background">
      {/* Email Header */}
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-4">
          <Avatar size="lg" className="flex-shrink-0">
            <AvatarFallback>
              <UserIcon className="w-5 h-5 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold truncate">{email.from}</h2>
              <Button variant="ghost" size="icon-sm" onClick={onStarToggle}>
                {email.isStarred ? (
                  <StarFilledIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <StarOutlineIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              宛先: {email.to.join(', ')}
            </p>
            {email.cc.length > 0 && (
              <p className="text-sm text-muted-foreground mb-1">
                CC: {email.cc.join(', ')}
              </p>
            )}
            <p className="text-xs text-muted-foreground">{email.receivedDate}</p>
          </div>
        </div>

        <h1 className="text-xl font-bold mb-2">{email.subject}</h1>
      </div>

      <Separator />

      {/* Email Content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none">
          {email.bodyHtml ? (
            <EmailHtmlRenderer html={email.bodyHtml} />
          ) : email.bodyText ? (
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">
              {email.bodyText}
            </div>
          ) : (
            <p className="text-muted-foreground">本文がありません</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex space-x-3">
          <Button onClick={onReplyClick} className="flex-1" size="lg">
            返信
          </Button>
          <Button
            onClick={onForwardClick}
            variant="secondary"
            className="flex-1"
            size="lg"
          >
            転送
          </Button>
          <Button onClick={onDeleteClick} variant="destructive" size="lg">
            削除
          </Button>
        </div>
      </div>
    </div>
  );
}
