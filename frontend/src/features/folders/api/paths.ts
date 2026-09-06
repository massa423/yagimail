export function folderListPath(): string {
  return '/api/v1/folders';
}

export function backendUrl(): string {
  return process.env.BACKEND_URL ?? 'http://localhost:8080';
}
