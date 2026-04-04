'use server';

export async function moveToTrash(
  folderId: string,
  mailIds: string[],
): Promise<void> {
  await Promise.all(
    mailIds.map(async (mailId) => {
      const res = await fetch(
        `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${encodeURIComponent(mailId)}/trash`,
        { method: 'POST' },
      );
      if (!res.ok) {
        throw new Error(`Failed to move mail ${mailId} to trash: ${res.status}`);
      }
    }),
  );
}
