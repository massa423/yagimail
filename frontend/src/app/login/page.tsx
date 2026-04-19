'use client';

import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/contexts';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">Yagimail</h1>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            if (!credentialResponse.credential) return;
            await login(credentialResponse.credential);
            router.replace('/sp');
          }}
          onError={() => console.error('Google login failed')}
        />
      </div>
    </div>
  );
}
