import { FolderPageClient } from './folder-page-client';
import { type MailItem } from '@/types/mail';
import { serverFetch } from '@/lib/server-fetch';

type FolderPageProps = {
  params: Promise<{
    folderName: string;
  }>;
};

async function getEmails(folderId: string, limit = 100): Promise<MailItem[]> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  const res = await serverFetch(
    `${backendUrl}/api/v1/folders/${encodeURIComponent(folderId)}/mails?limit=${limit}`,
    {
      next: { revalidate: 600 },
    },
  );

  if (!res.ok) {
    throw new Error('Failed to fetch emails');
  }

  return res.json();
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { folderName } = await params;
  const folderId = decodeURIComponent(folderName);
  const emails = await getEmails(folderId);

  return <FolderPageClient folderId={folderId} initialEmails={emails} />;
}
