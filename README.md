# EchoO - AI-Powered Influencer App

<div align="center">
  <img src="/public/echoo-logo-sm.png" alt="EchoO Logo" width="120" height="120">
  
  **Transform your content into influence**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.9-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![PWA](https://img.shields.io/badge/PWA-Ready-4285F4?style=flat-square&logo=pwa)](https://web.dev/progressive-web-apps/)
</div>

## 🚀 Overview

EchoO is a cutting-edge AI-powered influencer app designed to help content creators transform their photos into engaging social media posts that drive growth and engagement. Built with modern web technologies, EchoO provides an intuitive platform for content creation, event management, and AI-assisted social media optimization.

## ✨ Key Features

### 🤖 AI-Powered Content Creation

- **Smart Caption Generation**: AI analyzes your photos and generates engaging captions
- **Hashtag Optimization**: Intelligent hashtag suggestions for maximum reach
- **Content Strategy**: Personalized recommendations based on your content style
- **Platform Trends**: Real-time insights into trending topics and formats

### 📸 Photo Management

- **Smart Gallery**: Organized photo collections with automatic categorization
- **Filecoin Integration**: Decentralized storage for your content
- **Event-Based Organization**: Group photos by events and occasions
- **Advanced Upload**: Support for multiple file formats with progress tracking

### 🎯 Event Integration

- **Event Discovery**: Find and join relevant events in your area
- **Photo Matching**: Automatically match your photos to events
- **Community Features**: Connect with other creators at events
- **Registration Management**: Seamless event registration and management

### 💬 AI Chat Assistant

- **Personalized AI**: Chat with an AI assistant trained on your content
- **Real-time Suggestions**: Get instant feedback on your posts
- **Content Analysis**: Deep insights into your content performance
- **N8N Integration**: Powered by advanced workflow automation

### 📱 Progressive Web App

- **Mobile-First Design**: Optimized for mobile devices
- **Offline Support**: Access your content even without internet
- **App-like Experience**: Native app feel in your browser
- **Push Notifications**: Stay updated with your content performance

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4.1.9 with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend Integration

- **API**: RESTful API with OpenAPI specification
- **Authentication**: Custom auth system with JWT tokens
- **File Storage**: Filecoin for decentralized storage
- **Workflow Automation**: N8N for AI chat integration
- **Analytics**: Vercel Analytics

### Development Tools

- **Package Manager**: pnpm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode
- **Build Tool**: Next.js built-in bundler
- **CSS Processing**: PostCSS with Autoprefixer

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hyperparameters/echoo.git
   cd echoo
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=your_api_url

   # N8N Integration
   NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url

   # Filecoin Configuration
   NEXT_PUBLIC_FILECOIN_GATEWAY=your_filecoin_gateway
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
echoo-app/
├── app/                    # Next.js App Router pages
│   ├── agent/             # AI chat interface
│   ├── collections/       # Photo collections
│   ├── events/           # Event management
│   ├── gallery/          # Photo gallery
│   ├── home/             # Main dashboard
│   ├── settings/         # User settings
│   └── welcome/          # Onboarding flow
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── chat/            # Chat-related components
│   ├── onboarding/      # Onboarding flow components
│   └── magicui/         # Custom UI components
├── lib/                 # Utility libraries
│   ├── api/            # API client and types
│   └── utils.ts        # Shared utilities
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── services/           # External service integrations
└── public/             # Static assets
```

## 🎨 Design System

EchoO uses a custom design system built on top of Tailwind CSS:

### Brand Colors

- **Primary**: `#FF6B47` (Vibrant Orange)
- **Accent**: `#008B8B` (Dark Cyan)
- **Background**: Dark theme with gradient overlays
- **Glass Morphism**: Frosted glass effects for modern UI

### Typography

- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Responsive**: Mobile-first approach with fluid typography

### Components

- **Cards**: Glass morphism with subtle borders
- **Buttons**: Gradient backgrounds with hover effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Bottom navigation for mobile

## 🔧 Configuration

### N8N Integration

EchoO integrates with N8N for AI-powered chat functionality. See [N8N_SETUP.md](./N8N_SETUP.md) for detailed setup instructions.

### API Configuration

The app connects to a RESTful API with the following endpoints:

- **Authentication**: User login and profile management
- **Images**: Photo upload and management
- **Events**: Event discovery and registration
- **Collections**: Photo organization

### Filecoin Storage

Photos are stored on Filecoin for decentralized, permanent storage:

- Automatic IPFS pinning
- Content addressing with CIDs
- Redundant storage across the network

## 📱 PWA Features

EchoO is a Progressive Web App with the following features:

### Manifest Configuration

- **App Name**: EchoO
- **Short Name**: EchoO
- **Theme Color**: `#000000`
- **Background Color**: `#000000`
- **Display Mode**: Standalone

### App Shortcuts

- Home: Quick access to main dashboard
- Collections: View photo collections
- Events: Browse available events

### Icons

- 192x192px and 512x512px app icons
- Maskable icons for adaptive theming
- Apple touch icons for iOS

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in the Vercel dashboard
3. **Deploy** automatically on every push to main

### Manual Deployment

1. **Build the application**

   ```bash
   pnpm build
   ```

2. **Start the production server**
   ```bash
   pnpm start
   ```

### Environment Variables

Required environment variables for production:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.echoo.ing
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/chat
FILECOIN_UPLOAD_API_URL=<cloudflare-worker-upload-url>
```

## 🧪 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm update       # Update dependencies
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)
- **Conventional Commits**: For commit messages

### Testing

```bash
# Run tests (when implemented)
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Development Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for new features
- Update documentation for API changes
- Test your changes thoroughly
- Ensure mobile responsiveness

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [API Documentation](./openapi.json)
- [N8N Setup Guide](./N8N_SETUP.md)
- [Component Documentation](./components/README.md)

### Community

- **Twitter**: [@EchoOApp](https://twitter.com/echoo_ai)
- **Website**: [echoo.ing](https://echoo.ing)

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Advanced Analytics**: Detailed content performance metrics
- [ ] **Team Collaboration**: Multi-user workspaces
- [ ] **API Integrations**: Direct social media posting
- [ ] **Content Templates**: Pre-designed post templates
- [ ] **Scheduling**: Automated post scheduling
- [ ] **A/B Testing**: Content optimization tools

### Long-term Vision

- [ ] **Mobile Apps**: Native iOS and Android apps
- [ ] **AI Video**: Video content generation and optimization
- [ ] **Marketplace**: Content creator marketplace
- [ ] **Monetization**: Revenue sharing for creators

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Filecoin** for decentralized storage
- **N8N** for workflow automation

---

<div align="center">
  <p>Made with ❤️ by the EchoO Team</p>
  <p>
    <a href="https://echoo.ing">Website</a> •
    <a href="https://github.com/your-username/echoo-app">GitHub</a> •
    <a href="https://twitter.com/EchoOApp">Twitter</a>
  </p>
</div>
