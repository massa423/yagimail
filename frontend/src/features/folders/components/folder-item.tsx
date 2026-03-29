import FolderIconMap from '@/features/folders/components/folder-icon-map';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { type MailFolder } from '@/types/mail';

type FolderItemProps = {
  folder: MailFolder;
  isLast?: boolean;
};

export default async function FolderItem({ folder, isLast }: FolderItemProps) {
  return (
    <div>
      <Link
        className="flex items-center justify-between p-4 hover:bg-muted/50 active:bg-muted transition-colors cursor-pointer"
        href={`/sp/folder/${encodeURIComponent(folder.id)}`}
      >
        <div className="flex items-center space-x-3">
          <FolderIconMap folderName={folder.name} />
          <span className="text-base font-semibold">{folder.name}</span>
        </div>
        {folder.messagesUnread > 0 && (
          <Badge variant="destructive">
            {folder.messagesUnread > 99 ? '99+' : folder.messagesUnread}
          </Badge>
        )}
      </Link>
      {!isLast && <Separator className="ml-12" />}
    </div>
  );
}
