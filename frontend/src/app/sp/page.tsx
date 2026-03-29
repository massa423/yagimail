import { Header, BottomNavigation } from '@/components';
import { FolderList } from '@/features/folders';

export default async function SpMailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Yagimail" />
      <FolderList />
      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
