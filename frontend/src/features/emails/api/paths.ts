export function mailListPath(
  folderId: string,
  params: { limit: number; offset: number },
): string {
  const { limit, offset } = params;
  return `/api/v1/folders/${encodeURIComponent(folderId)}/mails?limit=${limit}&offset=${offset}`;
}

export function mailDetailPath(folderId: string, mailId: string): string {
  return `/api/v1/folders/${encodeURIComponent(folderId)}/mails/${encodeURIComponent(mailId)}`;
}

export function sendMailPath(): string {
  return '/api/v1/mails/send';
}

export function backendUrl(): string {
  return process.env.BACKEND_URL ?? 'http://localhost:8080';
}
