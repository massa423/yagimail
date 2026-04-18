'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { UserManager, WebStorageStateStore, type User } from 'oidc-client-ts';

function createUserManager() {
  return new UserManager({
    authority: 'https://accounts.google.com',
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid profile email',
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  });
}

let _userManager: UserManager | undefined;

function getUserManager(): UserManager {
  if (!_userManager) _userManager = createUserManager();
  return _userManager;
}

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mgr = getUserManager();
    mgr.getUser().then((u) => {
      setUser(u);
      setIsLoading(false);
    });

    const handleUserLoaded = (u: User) => setUser(u);
    const handleUserUnloaded = () => setUser(null);

    mgr.events.addUserLoaded(handleUserLoaded);
    mgr.events.addUserUnloaded(handleUserUnloaded);

    return () => {
      mgr.events.removeUserLoaded(handleUserLoaded);
      mgr.events.removeUserUnloaded(handleUserUnloaded);
    };
  }, []);

  const signIn = useCallback(async () => {
    await getUserManager().signinRedirect();
  }, []);

  const signOut = useCallback(async () => {
    await getUserManager().removeUser();
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export { getUserManager };
