'use server';

export async function toggleFlag(
  folderId: string,
  mailId: string,
): Promise<{ isStarred: boolean }> {
  const res = await fetch(
    `http://localhost:8080/api/v1/folders/${encodeURIComponent(folderId)}/mails/${mailId}/flag`,
    { method: 'PATCH' },
  );

  if (!res.ok) {
    throw new Error(`Failed to toggle flag: ${res.status}`);
  }

  return res.json();
}
