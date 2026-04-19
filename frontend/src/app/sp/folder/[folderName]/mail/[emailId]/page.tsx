import { MailDetailPageClient } from './mail-detail-page-client';
import { type MailDetail } from '@/types/mail';
import { serverFetch } from '@/lib/server-fetch';

type MailDetailPageProps = {
  params: Promise<{
    folderName: string;
    emailId: string;
  }>;
};

async function getMailDetail(
  folderId: string,
  mailId: string,
): Promise<MailDetail | null> {
  const res = await serverFetch(
    `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${encodeURIComponent(mailId)}`,
    {
      next: { revalidate: 600 },
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch mail detail');
  }

  return res.json();
}

export default async function MailDetailPage({ params }: MailDetailPageProps) {
  const { folderName, emailId } = await params;
  const folderId = decodeURIComponent(folderName);
  const email = await getMailDetail(folderId, emailId);

  return (
    <MailDetailPageClient folderId={folderId} emailId={emailId} email={email} />
  );
}
