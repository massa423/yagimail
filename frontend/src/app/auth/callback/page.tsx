'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userManager } from '@/contexts/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function handleCallback() {
      try {
        // oidc-client-ts が URL の code + state を読み取り、Google とトークン交換を行う
        const user = await userManager.signinRedirectCallback();

        // Google ID トークンを Spring Boot に送信し、独自 JWT Cookie を発行してもらう
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ idToken: user.id_token }),
        });

        if (!res.ok) {
          throw new Error(`Backend login failed: ${res.status}`);
        }

        // Google トークンは不要になったので localStorage から削除（XSS 対策）
        await userManager.removeUser();

        if (!cancelled) {
          router.replace('/sp');
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        if (!cancelled) {
          router.replace('/login?error=auth_failed');
        }
      }
    }

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">認証中...</p>
    </div>
  );
}
