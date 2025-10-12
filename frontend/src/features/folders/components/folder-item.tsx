import FolderIconMap from '@/features/folders/components/folder-icon-map';
import Link from 'next/link';
import { generateFolderPath } from '@/utils/navigation';

type FolderItemProps = {
  folder: {
    id: string;
    name: string;
    unreadCount: number;
    icon: string;
  };
  isLast?: boolean;
};

export default async function FolderItem({ folder, isLast }: FolderItemProps) {
  return (
    <div>
      <Link
        className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        href={generateFolderPath(folder.name)}
      >
        <div className="flex items-center space-x-3">
          <FolderIconMap folderName={folder.name} />
          <span className="text-base font-bold text-gray-900">
            {folder.name}
          </span>
        </div>
        {folder.unreadCount > 0 && (
          <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
            {folder.unreadCount > 99 ? '99+' : folder.unreadCount}
          </div>
        )}
      </Link>
      {!isLast && <div className="border-b border-gray-100 ml-12" />}
    </div>
  );
}
