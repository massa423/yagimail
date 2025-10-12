export type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

export type NavigationProps = {
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
};
