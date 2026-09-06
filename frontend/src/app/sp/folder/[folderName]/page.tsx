import { FolderPageClient } from './folder-page-client';

type FolderPageProps = {
  params: Promise<{
    folderName: string;
  }>;
};

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderName } = await params;
  const folderId = decodeURIComponent(folderName);

  return <FolderPageClient folderId={folderId} />;
}
