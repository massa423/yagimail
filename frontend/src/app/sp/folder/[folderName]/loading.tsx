import { Header, BottomNavigation } from '@/components';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function FolderLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="" showBackButton={true} backPath="/sp" />
      <div className="p-3">
        <Card className="gap-0 py-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center p-4 space-x-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              {i < 7 && <Separator className="ml-[68px]" />}
            </div>
          ))}
        </Card>
      </div>
      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
