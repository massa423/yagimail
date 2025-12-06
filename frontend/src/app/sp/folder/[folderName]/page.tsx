'use client';

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
  const folderName = decodeRouterPath(params.folderName);
  const { emails: emailList, toggleStar } = useEmailContext();

  const handleStarClick = (emailId: string) => {
    toggleStar(emailId);
    console.log('Star clicked:', emailId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={folderName} showBackButton={true} backPath="/sp" />

      <MailList
        emails={emailList}
        folderName={folderName}
        onStarClick={handleStarClick}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
