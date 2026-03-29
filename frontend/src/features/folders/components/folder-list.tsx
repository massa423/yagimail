import FolderItem from '@/features/folders/components/folder-item';
import { type MailFolder } from '@/types/mail';

async function getFolders(): Promise<MailFolder[]> {
  const res = await fetch('http://localhost:8080/api/v1/folders', {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch folders');
  }

  const data: { folders: MailFolder[] } = await res.json();
  return data.folders;
}

export default async function FolderList() {
  const folders = await getFolders();

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
