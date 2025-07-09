'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, BottomNavigation } from '../../components';
import { FolderList } from '../../features/folders';
import { folders } from '../../lib/data/folders';
import { generateFolderPath } from '../../utils/navigation';

export default function SpMailPage() {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState('home');

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      router.push(generateFolderPath(folder.name));
    }
  };

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    if (itemId === 'home') {
      router.push('/sp');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Yagimail" />

      <FolderList 
        folders={folders}
        onFolderClick={handleFolderClick}
      />

      <BottomNavigation 
        activeItem={activeNavItem}
        onItemClick={handleNavClick}
      />

      <div className="h-16"></div>
    </div>
  );
}