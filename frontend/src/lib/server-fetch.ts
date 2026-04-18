import { cookies } from 'next/headers';

export async function serverFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Cookie'] = `auth_token=${authToken.value}`;
  }

  return fetch(url, { ...init, headers });
}
