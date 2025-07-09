export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

export interface NavigationProps {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}