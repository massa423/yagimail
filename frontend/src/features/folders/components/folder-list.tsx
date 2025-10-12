import FolderItem from '@/features/folders/components/folder-item';
import { folders } from '@/lib/data/folders';

export default async function FolderList() {
  return (
    <div className="p-2">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {folders.map((folder, index) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isLast={index === folders.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
