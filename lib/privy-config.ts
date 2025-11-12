import { createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { createClient, http } from 'viem';

export const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base],
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

export const privyConfig = {
  // Required configuration
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || '',
  
  // Optional configuration
  appearance: {
    theme: 'dark',
    accentColor: '#8B5CF6',
    logo: '/echoo-logo-sm.png',
  },
  
  // Login methods to show in the UI
  loginMethods: ['email', 'google', 'twitter', 'discord'],
  
  // Embedded wallets configuration
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
  
  // Default chain for new users
  defaultChain: mainnet,
  
  // Wallet connection options
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
};

// Validate required environment variables
if (typeof window !== 'undefined' && !privyConfig.appId) {
  console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
}

if (typeof window !== 'undefined' && !privyConfig.walletConnectProjectId) {
  console.warn('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set. WalletConnect will not work.');
}
