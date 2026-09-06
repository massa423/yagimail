'use client';

import FolderItem from '@/features/folders/components/folder-item';
import { Card } from '@/components/ui/card';
import { useFoldersQuery } from '@/features/folders/hooks/use-folders-query';

export default function FolderList() {
  const { data: folders } = useFoldersQuery();

  if (!folders) {
    return null;
  }

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
