import { BackIcon } from '@/components/ui/icons/navigation-icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  rightAction?: React.ReactNode;
};

export default function Header({
  title,
  showBackButton,
  backPath,
  rightAction,
}: HeaderProps) {
  return (
    <header className="bg-background sticky top-0 z-10 border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {showBackButton && (
            <Button variant="ghost" size="icon-sm" asChild className="mr-2">
              <Link href={backPath || '/'}>
                <BackIcon className="w-5 h-5" />
              </Link>
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
