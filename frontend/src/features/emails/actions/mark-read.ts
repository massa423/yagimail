'use server';

export async function markRead(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  await Promise.all(
    mailIds.map((mailId) =>
      fetch(
        `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${mailId}/read`,
        { method: 'PATCH', body: JSON.stringify({ isRead: true }), headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  );
}
