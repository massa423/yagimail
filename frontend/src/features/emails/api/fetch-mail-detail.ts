import { type MailDetail } from '@/types/mail';
import { mailDetailPath } from './paths';

export async function fetchMailDetail(
  folderId: string,
  mailId: string,
): Promise<MailDetail | null> {
  const res = await fetch(mailDetailPath(folderId, mailId));
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch mail detail: ${res.status}`);
  }
  return res.json();
}
