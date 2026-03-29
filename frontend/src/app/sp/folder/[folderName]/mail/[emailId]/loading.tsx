import { Header, BottomNavigation } from '@/components';

export default function MailDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="" showBackButton={true} />

      <div className="bg-white p-4 space-y-4">
        {/* Subject */}
        <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />

        {/* Sender info */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
            <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
          </div>
          <div className="h-3 bg-gray-200 animate-pulse rounded w-16" />
        </div>

        {/* Body */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-5/6" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-full" />
          <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
        </div>
      </div>

      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
