import FolderItem from '@/features/folders/components/folder-item';
import { Card } from '@/components/ui/card';
import { type MailFolder } from '@/types/mail';
import { serverFetch } from '@/lib/server-fetch';

async function getFolders(): Promise<MailFolder[]> {
  const res = await serverFetch('http://localhost:8080/api/v1/folders', {
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
    <div className="p-3">
      <Card className="gap-0 py-0">
        {folders.map((folder, index) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isLast={index === folders.length - 1}
          />
        ))}
      </Card>
    </div>
  );
}
