'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import FolderItem from './components/FolderItem';
import BottomNavigation from './components/BottomNavigation';

interface MailFolder {
  id: string;
  name: string;
  unreadCount: number;
  icon: string;
}

export default function SpMailPage() {
  const router = useRouter();
  const [folders] = useState<MailFolder[]>([
    { id: '1', name: '受信トレイ', unreadCount: 15, icon: '📥' },
    { id: '2', name: '送信済み', unreadCount: 0, icon: '📤' },
    { id: '3', name: '下書き', unreadCount: 3, icon: '📝' },
    { id: '4', name: 'ゴミ箱', unreadCount: 0, icon: '🗑️' },
    { id: '5', name: 'スパム', unreadCount: 7, icon: '🚫' },
    { id: '6', name: '重要', unreadCount: 2, icon: '⭐' },
    { id: '7', name: 'アーカイブ', unreadCount: 0, icon: '📁' },
  ]);

  const [activeNavItem, setActiveNavItem] = useState('home');

  const handleFolderClick = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
      router.push(`/sp/folder/${encodeURIComponent(folder.name)}`);
    }
  };

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    console.log('Nav item clicked:', itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Yagimail" />

      <div className="p-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {folders.map((folder, index) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              onClick={() => handleFolderClick(folder.id)}
              isLast={index === folders.length - 1}
            />
          ))}
        </div>
      </div>

      <BottomNavigation 
        activeItem={activeNavItem}
        onItemClick={handleNavClick}
      />

      <div className="h-16"></div>
    </div>
  );
}