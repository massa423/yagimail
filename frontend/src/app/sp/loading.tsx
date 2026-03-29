import { Header, BottomNavigation } from '@/components';

export default function SpLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Yagimail" />
      <div className="p-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`flex items-center p-4 ${i < 5 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
              <div className="ml-3 flex-1 space-y-2">
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3" />
              </div>
              <div className="h-3 bg-gray-200 animate-pulse rounded w-12 ml-2" />
            </div>
          ))}
        </div>
      </div>
      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
