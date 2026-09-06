import { type MailItem } from '@/types/mail';
import { mailListPath } from './paths';

export async function fetchMails(
  folderId: string,
  params: { limit: number; offset: number },
): Promise<MailItem[]> {
  const res = await fetch(mailListPath(folderId, params));
  if (!res.ok) {
    throw new Error(`Failed to fetch mails: ${res.status}`);
  }
  return res.json();
}
