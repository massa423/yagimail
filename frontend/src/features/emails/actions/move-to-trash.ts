'use server';

export async function moveToTrash(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  await Promise.all(
    mailIds.map((mailId) =>
      fetch(
        `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${mailId}/trash`,
        { method: 'POST' },
      ),
    ),
  );
}
