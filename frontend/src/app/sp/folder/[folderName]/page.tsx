'use client';

import { Header, BottomNavigation } from '@/components';
import { MailList } from '@/features/emails';
import { decodeRouterPath } from '@/utils/navigation';
import { useEmailContext } from '@/contexts';
import { use } from 'react';

type FolderPageProps = {
  params: {
    folderName: string;
  };
};

export default function FolderPage({
  params,
}: {
  params: Promise<FolderPageProps['params']>;
}) {
  const { folderName } = use(params);
  const folderNameDecoded = decodeRouterPath(folderName);
  const { emails: emailList, toggleStar } = useEmailContext();

  const handleStarClick = (emailId: string) => {
    toggleStar(emailId);
    console.log('Star clicked:', emailId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={folderNameDecoded} showBackButton={true} backPath="/sp" />

      <MailList
        emails={emailList}
        folderName={folderNameDecoded}
        onStarClick={handleStarClick}
      />

      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
