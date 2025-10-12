import { EmailProvider } from '@/contexts';

export default function SpLayout({ children }: { children: React.ReactNode }) {
  return <EmailProvider>{children}</EmailProvider>;
}
