import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth(redirectTo = '/login') {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push(redirectTo);
    }
  }, [ready, authenticated, router, redirectTo]);

  return { ready, authenticated };
}

export function useRedirectIfAuthenticated(redirectTo = '/dashboard') {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push(redirectTo);
    }
  }, [ready, authenticated, router, redirectTo]);

  return { ready, authenticated };
}
