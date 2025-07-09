import { HomeIcon, SearchIcon, ComposeIcon, SettingsIcon } from './icons/navigation-icons';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface BottomNavigationProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

export default function BottomNavigation({ activeItem, onItemClick }: BottomNavigationProps) {
  const navItems: NavItem[] = [
    { id: 'home', label: 'ホーム', icon: HomeIcon },
    { id: 'search', label: '検索', icon: SearchIcon },
    { id: 'compose', label: '作成', icon: ComposeIcon },
    { id: 'settings', label: '設定', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center py-2 px-4 ${
                activeItem === item.id ? 'text-blue-600' : 'text-gray-400'
              }`}
              onClick={() => onItemClick?.(item.id)}
            >
              <IconComponent className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}