'use client';

import { useRouter } from 'next/navigation';
import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import { decodeRouterPath } from '@/utils/navigation';
import { useEmailContext } from '@/contexts';

type FolderPageProps = {
  params: {
    folderName: string;
  };
};

export default function FolderPage({ params }: FolderPageProps) {
  const router = useRouter();
  const folderName = decodeRouterPath(params.folderName);

  const { emails: emailList, toggleStar } = useEmailContext();

  const handleBackClick = () => {
    router.push('/sp');
  };

  const handleMailClick = (emailId: string) => {
    router.push(`/sp/folder/${encodeURIComponent(folderName)}/mail/${emailId}`);
  };

  const handleStarClick = (emailId: string) => {
    toggleStar(emailId);
    console.log('Star clicked:', emailId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={folderName}
        showBackButton={true}
        onBackClick={handleBackClick}
      />

      <MailList
        emails={emailList}
        onMailClick={handleMailClick}
        onStarClick={handleStarClick}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
