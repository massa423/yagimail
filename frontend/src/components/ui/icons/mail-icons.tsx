import { Star, User, Mail } from 'lucide-react';

export { User as UserIcon, Mail as MailIcon };

export const StarFilledIcon = ({ className }: { className?: string }) => (
  <Star className={className} fill="currentColor" />
);

export const StarOutlineIcon = ({ className }: { className?: string }) => (
  <Star className={className} />
);
