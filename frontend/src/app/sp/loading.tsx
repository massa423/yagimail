import { Header, BottomNavigation } from '@/components';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function SpLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Yagimail" />
      <div className="p-3">
        <Card className="gap-0 py-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center p-4 space-x-3">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
              {i < 5 && <Separator className="ml-[68px]" />}
            </div>
          ))}
        </Card>
      </div>
      <BottomNavigation />
      <div className="h-16"></div>
    </div>
  );
}
