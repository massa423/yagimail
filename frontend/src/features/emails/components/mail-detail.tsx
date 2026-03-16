import {
  UserIcon,
  StarFilledIcon,
  StarOutlineIcon,
} from '@/components/ui/icons/mail-icons';
import { type MailDetail } from '@/types/mail';

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
    <div className="flex-1 bg-white">
      {/* Email Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                {email.from}
              </h2>
              <button onClick={onStarToggle} className="p-1">
                {email.isStarred ? (
                  <StarFilledIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <StarOutlineIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              宛先: {email.to.join(', ')}
            </p>
            {email.cc.length > 0 && (
              <p className="text-sm text-gray-600 mb-1">
                CC: {email.cc.join(', ')}
              </p>
            )}
            <p className="text-sm text-gray-500">{email.receivedDate}</p>
          </div>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {email.subject}
        </h1>
      </div>

      {/* Email Content */}
      <div className="p-4">
        <div className="prose prose-sm max-w-none">
          {email.bodyHtml ? (
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: email.bodyHtml }}
            />
          ) : email.bodyText ? (
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {email.bodyText}
            </div>
          ) : (
            <p className="text-gray-500">本文がありません</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <button
            onClick={onReplyClick}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            返信
          </button>
          <button
            onClick={onForwardClick}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            転送
          </button>
          <button
            onClick={onDeleteClick}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
