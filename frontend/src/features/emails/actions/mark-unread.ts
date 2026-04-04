'use server';

export async function markUnread(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  await Promise.all(
    mailIds.map((mailId) =>
      fetch(
        `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${mailId}/read`,
        { method: 'PATCH', body: JSON.stringify({ isRead: false }), headers: { 'Content-Type': 'application/json' } },
      ),
    ),
  );
}
