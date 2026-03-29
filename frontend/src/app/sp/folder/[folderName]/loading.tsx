import { Header, BottomNavigation } from '@/components';

export default function FolderLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="" showBackButton={true} backPath="/sp" />
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start p-4 bg-white">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="ml-3 flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
              </div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
