import { UserIcon, StarFilledIcon, StarOutlineIcon } from './icons/MailIcons';

interface MailItemProps {
  mail: {
    id: string;
    displayName: string;
    subject: string;
    receivedDate: string;
    isStarred: boolean;
    isRead: boolean;
    senderIcon: string;
  };
  onClick?: () => void;
  onStarClick?: () => void;
  isLast?: boolean;
}

export default function MailItem({ mail, onClick, onStarClick, isLast }: MailItemProps) {
  return (
    <div>
      <div 
        className="flex items-start p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        onClick={onClick}
      >
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${mail.isRead ? 'text-gray-700' : 'text-gray-900 font-bold'}`}>
                  {mail.displayName}
                </h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {mail.receivedDate}
                </span>
              </div>
              <p className={`text-sm mt-1 ${mail.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                {mail.subject}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 ml-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStarClick?.();
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            {mail.isStarred ? (
              <StarFilledIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <StarOutlineIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {!isLast && <div className="border-b border-gray-100 ml-16" />}
    </div>
  );
}