'use server';

import { serverFetch } from '@/lib/server-fetch';

export async function moveToTrash(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  const res = await serverFetch(
    `${backendUrl}/api/v1/folders/${encodeURIComponent(folderId)}/mails/trash`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mailIds }),
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to move mails to trash: ${res.status}`);
  }
}
