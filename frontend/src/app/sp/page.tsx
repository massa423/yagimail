import { Header, BottomNavigation } from '@/components';
import { FolderList } from '@/features/folders';

export default async function SpMailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Yagimail" />
      <FolderList />
      <BottomNavigation />

      <div className="h-16"></div>
    </div>
  );
}
