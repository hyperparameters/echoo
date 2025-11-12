# Echoo - AI-Powered Social Media Platform

<div align="center">
  <img src="/public/echoo-logo-sm.png" alt="Echoo Logo" width="120" height="120">
  
  **Transform your event photos into lasting memories**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-4285F4?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
</div>

## 🚀 Overview

Echoo is a modern web3-enabled social media platform that helps users discover, collect, and manage event photos. Built with Next.js 14 and powered by AI, Echoo provides intelligent photo matching, decentralized storage, and seamless event management.

## ✨ Key Features

### 🔐 Web3 Authentication
- **Privy Integration**: Wallet-based authentication with social login fallback
- **Multi-Chain Support**: Support for Ethereum and other EVM chains via Wagmi
- **Secure Sessions**: JWT-based session management with automatic refresh

### 📸 Event Photo Management
- **FotoOwl Integration**: AI-powered photo matching for events
- **Smart Gallery**: Discover your photos from events automatically
- **Event Registration**: Register for events using your selfie
- **Photo Collections**: Organize photos by events and occasions

### 💾 Decentralized Storage
- **Filecoin/IPFS**: Permanent, decentralized storage for your photos
- **Content Addressing**: Retrieve photos using CIDs
- **Redundant Storage**: Photos stored across the decentralized network

### 🤖 AI Chat Assistant
- **N8N Integration**: Powered by advanced workflow automation
- **Platform Trends**: AI-generated insights into social media trends
- **Post Suggestions**: Get AI-powered content ideas and hashtag recommendations
- **Personalized Assistance**: Chat with an AI trained on your content preferences

### 📱 Progressive Web App
- **Mobile-First**: Optimized responsive design for all devices
- **Offline Support**: Access your content even without internet
- **App-like Experience**: Native app feel with PWA capabilities
- **Install Prompt**: Add to home screen on mobile devices

## 🛠️ Technology Stack

### Frontend Core
- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI primitives with shadcn/ui
- **Icons**: Lucide React

### State & Data Management
- **Data Fetching**: TanStack Query (React Query) v5
- **Global State**: Zustand
- **Form Management**: React Hook Form with Zod validation
- **API Client**: Custom OpenAPI client

### Web3 & Authentication
- **Auth Provider**: Privy (wallet + social login)
- **Wallet Integration**: Wagmi v2 + Viem
- **Multi-Chain**: Support for Ethereum and EVM chains

### UI/UX Libraries
- **Animations**: Framer Motion
- **Carousels**: Embla Carousel React
- **Photo Gallery**: React Photo Album
- **Notifications**: Sonner (toast notifications)
- **Charts**: Recharts (for analytics)

### Developer Tools
- **Package Manager**: pnpm (recommended)
- **Build Tool**: Next.js built-in bundler (Turbopack)
- **Linting**: ESLint with Next.js config
- **Type Safety**: TypeScript strict mode
- **CSS Processing**: PostCSS with Autoprefixer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/echoo.git
   cd echoo/echoo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   
   # Privy Authentication
   NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
   
   # N8N Chat Integration
   NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url
   
   # Filecoin Upload (Cloudflare Worker)
   FILECOIN_UPLOAD_API_URL=your_cloudflare_worker_url
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
echoo/
├── app/                      # Next.js App Router
│   ├── agent/               # AI chat interface
│   ├── collections/         # Photo collections page
│   ├── details/             # Event details page
│   ├── events/              # Events discovery & management
│   ├── gallery/             # Photo gallery views
│   │   └── [eventId]/      # Event-specific gallery
│   ├── home/                # Main dashboard
│   ├── selfie/              # Selfie upload for registration
│   ├── settings/            # User settings & profile
│   ├── welcome/             # Onboarding flow
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui components (50 files)
│   ├── chat/                # Chat-related components
│   │   ├── PlatformTrendsComponent.tsx
│   │   └── PostSuggestionsComponent.tsx
│   ├── onboarding/          # Onboarding flow components
│   ├── magicui/             # Custom animated components
│   ├── app-layout.tsx       # Main app layout wrapper
│   ├── bottom-navigation.tsx # Mobile navigation
│   ├── n8n-chat.tsx         # N8N chat integration
│   ├── photo-gallery.tsx    # Photo grid component
│   ├── privy-provider.tsx   # Privy auth wrapper
│   └── theme-provider.tsx   # Dark mode provider
├── lib/                     # Utility libraries
│   ├── api/                 # API client & services (6 files)
│   ├── auth-utils.ts        # Authentication helpers
│   ├── privy-config.ts      # Privy configuration
│   └── utils.ts             # Shared utility functions
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts        # Mobile detection
│   ├── use-toast.ts         # Toast notifications
│   └── useOnboarding.ts     # Onboarding state
├── services/                # External service integrations
│   └── upload.ts            # File upload service
├── stores/                  # Zustand state stores
├── public/                  # Static assets
│   ├── echoo-logo-*.png     # Logo variants
│   ├── manifest.json        # PWA manifest
│   └── *.jpg, *.png         # Images and placeholders
├── openapi.json             # API specification
├── components.json          # shadcn/ui config
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── next.config.mjs          # Next.js configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Custom gradient backgrounds
- **Dark Theme**: Default dark mode with glass morphism effects
- **Accents**: Dynamic color scheme based on content

### Typography
- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Responsive**: Fluid typography scales across devices

### Component Library
Built on shadcn/ui with 50+ customized components:
- Buttons, Cards, Dialogs, Forms
- Sheets, Toasts, Tooltips, Popovers
- Accordions, Tabs, Carousels
- Command palette, Context menus

## 🔧 Key Configurations

### N8N Chat Integration

The AI chat is powered by N8N workflows. Configure your webhook URL:

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
```

Features:
- Platform trend analysis
- Post suggestions with hashtags
- Real-time chat interface
- Conversation history

### Privy Authentication

Configure Privy for wallet and social authentication:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
```

Supported login methods:
- Email
- Wallet (MetaMask, WalletConnect, etc.)
- Social (Google, Twitter, etc.)

### API Integration

Connect to the Echoo backend API:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Key endpoints:
- `/auth/privy` - Privy authentication
- `/profile` - User profile management
- `/events` - Event discovery and registration
- `/images` - Photo management
- `/getEventList` - Public events
- `/get-event-matched-image-list` - FotoOwl matched photos

## 📱 PWA Configuration

### Manifest (`public/manifest.json`)

```json
{
  "name": "Echoo",
  "short_name": "Echoo",
  "theme_color": "#000000",
  "background_color": "#000000",
  "display": "standalone",
  "icons": [
    {
      "src": "/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Features
- Install on mobile home screen
- Offline support with service workers
- App-like navigation and interactions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Configure environment variables** in dashboard
3. **Deploy** automatically on push to main branch

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/echoo)

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Production Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://api.echoo.ing/api/v1
NEXT_PUBLIC_PRIVY_APP_ID=your_production_privy_app_id
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/chat
FILECOIN_UPLOAD_API_URL=https://your-worker.workers.dev/upload
```

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server (http://localhost:3000)
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

### Development Guidelines

- **TypeScript**: Use strict mode, define types for all props
- **Components**: Follow shadcn/ui patterns for consistency
- **State**: Use TanStack Query for server state, Zustand for client state
- **Styling**: Use Tailwind utility classes, avoid inline styles
- **API**: Use the generated API client from `lib/api/`
- **Forms**: Use React Hook Form with Zod schemas
- **Testing**: Write tests for critical user flows (when implemented)

### Code Style

- ESLint configuration based on Next.js recommendations
- Prettier for consistent formatting (if configured)
- Conventional commits for clear git history

## 🔌 API Client

The app uses a type-safe API client generated from OpenAPI spec:

```typescript
import { eventsApi, imagesApi, profileApi } from '@/lib/api'

// Fetch user profile
const profile = await profileApi.getProfile()

// Register for event
const registration = await eventsApi.registerEvent({ event_id: 123 })

// Get user images
const images = await imagesApi.getUserImages()
```

## 🗺️ Roadmap

### In Progress
- [ ] Enhanced photo editing tools
- [ ] Social sharing improvements
- [ ] Advanced AI recommendations

### Planned Features
- [ ] Direct social media posting
- [ ] Multi-event photo organization
- [ ] Collaborative albums
- [ ] Video content support
- [ ] Native mobile apps (iOS/Android)

### Long-term Vision
- [ ] Creator marketplace
- [ ] NFT integration for photos
- [ ] Live event streaming
- [ ] Advanced analytics dashboard

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Privy** - Simple web3 authentication
- **Vercel** - Hosting and deployment platform
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack** - Powerful data synchronization
- **FotoOwl** - AI-powered photo matching
- **Filecoin** - Decentralized storage network

---

<div align="center">
  <p>Made with ❤️ by the Echoo Team</p>
  <p>
    <a href="https://echoo.ing">Website</a> •
    <a href="https://github.com/your-org/echoo">GitHub</a> •
    <a href="https://twitter.com/echoo_ai">Twitter</a>
  </p>
</div>
