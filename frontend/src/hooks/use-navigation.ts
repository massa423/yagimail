import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const useNavigation = () => {
  const router = useRouter();
  const [activeNavItem, setActiveNavItem] = useState('home');

  const handleNavClick = (itemId: string) => {
    setActiveNavItem(itemId);
    
    switch (itemId) {
      case 'home':
        router.push('/sp');
        break;
      case 'search':
        // TODO: Implement search functionality
        break;
      case 'compose':
        // TODO: Implement compose functionality
        break;
      case 'settings':
        // TODO: Implement settings functionality
        break;
    }
  };

  return {
    activeNavItem,
    handleNavClick
  };
};