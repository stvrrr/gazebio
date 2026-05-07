# ✨ Gazebio - Premium Bio Link Page Builder

A stunning, modern web application for creating customizable bio link pages with beautiful animations, advanced themes, and powerful analytics. Perfect for creators, gamers, and influencers.

## 🚀 Features

### 🎨 Design System
- **Dark Mode Default** - Premium dark theme with glassmorphism UI
- **6+ Premium Themes** - Minimal Light, Dark Modern, Neon Gamer, Cyberpunk Glow, Soft Aesthetic, Gradient Glass
- **Smooth Animations** - Fade-in, scale, slide transitions with micro-interactions
- **Customizable Colors** - Color picker for primary color customization
- **Multiple Button Styles** - Rounded, Pill, Glow, Glass button designs
- **Responsive Design** - Mobile-first responsive layout

### 🔐 Authentication
- Sign up with email/password
- Username-based public URLs (e.g., gazebio.com/username)
- Secure Firebase authentication
- Session management

### 📊 Dashboard
- Real-time stats overview (Views, Link Clicks, Link Count)
- Quick actions (Edit Page, View Live, Copy Link)
- Link analytics with click tracking
- Recent activity timeline

### 🛠️ Page Editor
- **Profile Section** - Upload profile image, edit bio and display name
- **Link Management** - Add, edit, delete, and reorder links
- **Theme & Customization** - Theme presets and color customization
- **Live Preview** - Real-time preview of changes
- **Split Layout** - Side-by-side editor and preview

### 🌐 Public Profile Page
- Mobile-optimized responsive design
- Theme-based styling
- Link click tracking
- Profile view analytics
- Smooth entrance animations

### 📈 Analytics (Basic)
- Profile view counter
- Link click tracking
- Link performance metrics
- Top performing link highlights

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: CSS animations + Framer Motion ready
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **State Management**: Zustand
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast
- **Deployment**: Ready for Vercel

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works great!)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd gazebio
npm install
```

2. **Configure Supabase**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Create database tables using SQL (see SUPABASE_SETUP.md)
   - Enable Authentication
   - Create Storage bucket for profile images
   - Get your project credentials

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
gazebio/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   ├── signup/            # Sign up page
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── editor/            # Page editor
│   ├── settings/          # Settings page
│   └── [username]/        # Public profile page
├── components/            # React components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Navigation.tsx
│   ├── SignUpForm.tsx
│   ├── SignInForm.tsx
│   ├── StatsOverview.tsx
│   ├── QuickActions.tsx
│   ├── AnalyticsPreview.tsx
│   ├── ProfileEditor.tsx
│   ├── LinkEditor.tsx
│   ├── ThemeEditor.tsx
│   └── LivePreview.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility functions
│   ├── firebase.ts        # Firebase initialization
│   ├── db.ts             # Database operations
│   ├── themes.ts         # Theme presets
│   └── utils.ts          # Helper functions
├── store/                 # Zustand store
│   └── profileStore.ts    # Profile state management
├── types/                 # TypeScript types
│   └── index.ts
├── styles/                # Global styles
│   └── globals.css
├── tailwind.config.js     # Tailwind configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
└── package.json
```

## 🎨 Customization

### Adding New Themes

Edit `lib/themes.ts` to add new theme presets:

```typescript
'custom-theme': {
  name: 'custom-theme',
  primaryColor: '#FF1493',
  secondaryColor: '#1a1a2e',
  accentColor: '#00BFFF',
  backgroundColor: '#0a0a15',
  textColor: '#ffffff',
  buttonStyle: 'rounded',
},
```

### Extending Components

All components are designed to be extensible:
- Button variants: `primary`, `secondary`, `ghost`, `danger`, `glow`
- Card types: `Card`, `StatCard`, `GlassCard`
- Input types: `Input`, `TextArea`

### Tailwind Configuration

Custom theme tokens in `tailwind.config.js`:
- Colors: glass-light, glass-dark, glow-purple, glow-pink, glow-cyan, neon colors
- Shadows: glass, glow effects
- Animations: fade-in, fade-in-up, scale-in, slide-in, float, glow-pulse

## 📚 Usage Guide

### For Users

1. **Sign Up** - Create an account with username and email
2. **Customize Profile** - Add profile image, bio, display name
3. **Add Links** - Create links to your content
4. **Choose Theme** - Select from 6 premium themes
5. **Customize Colors** - Pick your primary color
6. **Share URL** - Share your public page: `gazebio.com/yourname`
7. **Track Analytics** - Monitor views and clicks on dashboard

### For Developers

- Fork and customize the design system
- Add new features in the dashboard
- Extend analytics capabilities
- Add premium features (custom domains, etc.)

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts and set your environment variables in Vercel dashboard.

### Deploy to Other Platforms

The project is optimized for any Node.js hosting platform (Netlify, Railway, etc.). Just ensure:
- Node.js 18+ runtime
- Environment variables configured
- Build command: `npm run build`
- Start command: `npm start`

## 🔮 Future Premium Features (Structure Ready)

- View counter with detailed analytics
- Link click heatmaps
- Custom domain support
- Premium theme pack
- Remove branding
- Advanced styling options
- Team collaboration
- API access

## 🐛 Known Limitations

- Drag-and-drop link reordering UI (backend ready)
- Email verification
- Two-factor authentication
- Password reset functionality
- User notifications

These are intentionally kept minimal for the MVP but are architected for easy addition.

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

For issues and questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include reproduction steps and environment info

## 🙏 Acknowledgments

- Inspired by Linktree and modern SaaS design patterns
- UI/UX best practices from premium startup tools
- Glassmorphism design trend

---

Built with ❤️ for creators and gamers.

**Made with Gazebio** ✨