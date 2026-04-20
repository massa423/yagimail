'use server';

import { serverFetch } from '@/lib/server-fetch';

export async function markUnread(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';
  const res = await serverFetch(
    `${backendUrl}/api/v1/folders/${encodeURIComponent(folderId)}/mails/read`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mailIds, isRead: false }),
    },
  );
  if (!res.ok) {
    throw new Error(`Failed to mark mails as unread: ${res.status}`);
  }
}
