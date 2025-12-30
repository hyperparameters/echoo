/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['auth.privy.io'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `connect-src 'self' http://localhost:8000 http://localhost:7378 https://auth.privy.io https://*.privy.io https://explorer-api.walletconnect.com https://*.walletconnect.com https://*.walletconnect.org https://*.ngrok.io https://*.ngrok-free.app https://*.ngrok-free.dev https://api.openserv.ai https://*.openserv.ai https://*.workers.dev https://*.cdn08.workers.dev`,
              "frame-src 'self' https://auth.privy.io https://*.privy.io https://*.walletconnect.com https://*.walletconnect.org",
              "frame-ancestors 'self' http://localhost:3000 https://echoo.ing https://www.echoo.ing https://auth.privy.io",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.privy.io https://*.walletconnect.com https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://auth.privy.io https://*.walletconnect.com",
              "img-src 'self' data: blob: https://*.privy.io https://*.walletconnect.com http://localhost:8000 https://*.workers.dev https://*.cdn08.workers.dev https://ipfs.io https://gateway.pinata.cloud https://cloudflare-ipfs.com",
              "font-src 'self' data: https://auth.privy.io https://*.walletconnect.com",
              "form-action 'self' https://auth.privy.io"
            ].join('; ')
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ]
  }
}

export default nextConfig
