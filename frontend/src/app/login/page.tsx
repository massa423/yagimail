'use client';

import { useAuth } from '@/contexts';

export default function LoginPage() {
  const { signIn, isLoading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Yagimail</h1>
        <button
          onClick={signIn}
          disabled={isLoading}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Googleでサインイン
        </button>
      </div>
    </div>
  );
}
