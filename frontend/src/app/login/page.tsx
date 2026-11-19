'use client';

import { useRouter } from 'next/navigation';
import { Unbounded } from 'next/font/google';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts';

const unbounded = Unbounded({ subsets: ['latin'], weight: ['500'] });

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-(--envelope) text-(--ink) [--edge:#2c3b66] [--envelope:#0d1630] [--flap:#131e3d] [--ink:#e8edf8] [--ink-muted:#8d9bc0] [--seal:#a8c7ff]">
      {/* 封筒のフラップ。ログイン画面全体を封筒の裏面に見立てる */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[44dvh] origin-top motion-safe:animate-flap-fold"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <polygon points="0,0 100,0 50,100" fill="var(--flap)" />
          <polyline
            points="0,0 50,100 100,0"
            fill="none"
            stroke="var(--edge)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <main className="relative flex flex-col items-center px-4 pt-[44dvh] pb-16 text-center">
        <div
          aria-hidden
          className={`${unbounded.className} -mt-6 flex h-12 w-12 items-center justify-center rounded-full bg-(--seal) text-lg text-(--envelope) shadow-[0_0_32px_rgb(168_199_255/0.35)] motion-safe:animate-seal-stamp`}
        >
          Y
        </div>

        <div className="mt-10 flex flex-col items-center gap-12 motion-safe:animate-letter-reveal">
          <h1
            className={`${unbounded.className} text-4xl font-medium tracking-tight`}
          >
            Yagimail
          </h1>

          <div className="flex flex-col items-center gap-4">
            <GoogleLogin
              theme="filled_black"
              size="large"
              shape="pill"
              text="continue_with"
              width={280}
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;
                await login(credentialResponse.credential);
                router.replace('/sp');
              }}
              onError={() => console.error('Google login failed')}
            />
            <p className="text-xs text-(--ink-muted)">
              Sign in to open your inbox
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
