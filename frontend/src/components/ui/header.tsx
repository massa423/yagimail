import { BackIcon } from './icons/navigation-icons';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title, showBackButton, onBackClick, rightAction }: HeaderProps) {
  return (
    <header className="bg-blue-900 text-white sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {showBackButton && (
            <button 
              onClick={onBackClick}
              className="mr-3 text-white hover:bg-blue-700 rounded-full p-1"
            >
              <BackIcon className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightAction && (
          <div>{rightAction}</div>
        )}
      </div>
    </header>
  );
}