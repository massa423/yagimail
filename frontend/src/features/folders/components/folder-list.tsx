import FolderItem from './folder-item';
import { type MailFolder } from '../../../lib/data/folders';

interface FolderListProps {
  folders: MailFolder[];
  onFolderClick?: (folderId: string) => void;
}

export default function FolderList({ folders, onFolderClick }: FolderListProps) {
  return (
    <div className="p-2">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {folders.map((folder, index) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            onClick={() => onFolderClick?.(folder.id)}
            isLast={index === folders.length - 1}
          />
        ))}
      </div>
    </div>
  );
}