'use client';

import { useEffect } from 'react';
import { PrivyProvider as BasePrivyProvider, usePrivy } from '@privy-io/react-auth';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/privy-config';
import { setPrivyAccessTokenGetter } from '@/lib/api/client';
import { authApi } from '@/lib/api/auth';

/**
 * Internal component to connect Privy authentication with our API client
 */
function PrivyAuthConnector({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, getAccessToken, user } = usePrivy();

  useEffect(() => {
    // Connect Privy's getAccessToken to our API client
    if (ready) {
      setPrivyAccessTokenGetter(getAccessToken);
      console.log('✅ Privy authentication connected to API client');
    }
  }, [ready, getAccessToken]);

  useEffect(() => {
    // Auto-authenticate with backend when user logs in with Privy
    if (ready && authenticated && user) {
      const authenticateWithBackend = async () => {
        try {
          const token = await getAccessToken();
          if (token) {
            console.log('🔐 Authenticating with backend...');
            await authApi.privyAuth();
            console.log('✅ Backend authentication successful');
          }
        } catch (error) {
          console.error('❌ Backend authentication failed:', error);
          // Don't block the UI if backend auth fails
        }
      };

      authenticateWithBackend();
    }
  }, [ready, authenticated, user, getAccessToken]);

  return <>{children}</>;
}

export function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        // Login methods: Email (with OTP), Google, Twitter, Discord OAuth
        loginMethods: ['email', 'google', 'twitter', 'discord'],
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
          logo: '/echoo-logo-sm.png',
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        // Default chain for embedded wallets
        defaultChain: config.chains[0],
      }}
    >
      <WagmiProvider config={config}>
        <PrivyAuthConnector>
          {children}
        </PrivyAuthConnector>
      </WagmiProvider>
    </BasePrivyProvider>
  );
}
