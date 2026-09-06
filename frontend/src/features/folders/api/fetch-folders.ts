import { type MailFolder } from '@/types/mail';
import { folderListPath } from './paths';

export async function fetchFolders(): Promise<MailFolder[]> {
  const res = await fetch(folderListPath());
  if (!res.ok) {
    throw new Error(`Failed to fetch folders: ${res.status}`);
  }
  const data: { folders: MailFolder[] } = await res.json();
  return data.folders;
}
