import { Header, BottomNavigation } from '@/components';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function MailDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="" showBackButton={true} />

      <div className="p-4 space-y-4">
        {/* Sender info */}
        <div className="flex items-center space-x-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Subject */}
        <Skeleton className="h-6 w-3/4" />
      </div>

      <Separator />

      {/* Body */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>

      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
