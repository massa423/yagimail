'use client';

import {
  HomeIcon,
  SearchIcon,
  ComposeIcon,
  SettingsIcon,
} from '@/components/ui/icons/navigation-icons';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function BottomNavigation() {
  const navItems: NavItem[] = [
    { id: 'home', label: 'ホーム', icon: HomeIcon },
    { id: 'search', label: '検索', icon: SearchIcon },
    { id: 'compose', label: '作成', icon: ComposeIcon },
    { id: 'settings', label: '設定', icon: SettingsIcon },
  ];
  const [activeNavItem, setActiveNavItem] = useState('home');
  const router = useRouter();

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    if (itemId === 'home') {
      router.push('/sp');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around py-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeNavItem === item.id;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex flex-col h-auto gap-0.5 py-2 px-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => handleNavClick(item.id)}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
