import { MailDetailPageClient } from './mail-detail-page-client';

type MailDetailPageProps = {
  params: Promise<{
    folderName: string;
    emailId: string;
  }>;
};

export default async function MailDetailPage({ params }: MailDetailPageProps) {
  const { folderName, emailId } = await params;
  const folderId = decodeURIComponent(folderName);

  return <MailDetailPageClient folderId={folderId} emailId={emailId} />;
}
