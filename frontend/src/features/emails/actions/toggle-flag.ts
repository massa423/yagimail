'use server';

import { serverFetch } from '@/lib/server-fetch';

export async function toggleFlag(
  folderId: string,
  mailId: string,
): Promise<{ isStarred: boolean }> {
  const res = await serverFetch(
    `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${mailId}/flag`,
    { method: 'PATCH' },
  );

  if (!res.ok) {
    throw new Error(`Failed to toggle flag: ${res.status}`);
  }

  return res.json();
}
