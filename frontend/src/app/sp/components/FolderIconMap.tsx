import { 
  InboxIcon, 
  SentIcon, 
  DraftIcon, 
  TrashIcon, 
  SpamIcon, 
  StarIcon, 
  ArchiveIcon 
} from './icons/MailFolderIcons';

interface FolderIconProps {
  folderName: string;
  className?: string;
}

export default function FolderIconMap({ folderName, className = "w-5 h-5 text-gray-600" }: FolderIconProps) {
  const getIcon = () => {
    switch (folderName) {
      case '受信トレイ':
        return <InboxIcon className={className} />;
      case '送信済み':
        return <SentIcon className={className} />;
      case '下書き':
        return <DraftIcon className={className} />;
      case 'ゴミ箱':
        return <TrashIcon className={className} />;
      case 'スパム':
        return <SpamIcon className={className} />;
      case '重要':
        return <StarIcon className={className} />;
      case 'アーカイブ':
        return <ArchiveIcon className={className} />;
      default:
        return <InboxIcon className={className} />;
    }
  };

  return getIcon();
}