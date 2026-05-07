# Quick Start Guide - Gazebio

Get Gazebio up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)
- A code editor (VS Code recommended)

## Installation (5 steps)

### Step 1: Clone & Install (2 min)

```bash
git clone <your-repo-url>
cd gazebio
npm install
```

### Step 2: Setup Supabase (2 min)

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed steps:
1. Create a Supabase project
2. Run SQL queries to create tables
3. Enable Email authentication
4. Create `profile-images` storage bucket
5. Configure Row Level Security (RLS)

### Step 3: Configure Environment (1 min)

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Find these in your [Supabase Dashboard](https://app.supabase.com/) under Settings > API.

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 5: Test It Out!

1. Click "Get Started Free"
2. Sign up with an email
3. Go to dashboard
4. Click "Edit Page"
5. Add a link and choose a theme
6. Click "View Live" to see your page!

## File Structure (Understand in 5 min)

```
gazebio/
├── app/              # Pages & routes
├── components/       # Reusable UI components
├── lib/             # Utilities & Supabase operations
├── store/           # State management
├── types/           # TypeScript types
├── styles/          # Global styles
│
├── README.md        # Full documentation
├── SUPABASE_SETUP.md # Supabase setup guide  
└── DEVELOPMENT.md    # Developer guide
```

## Common Tasks

### Add a New Link

The app already handles this! Just:
1. Go to Dashboard → Edit Page
2. Scroll to "Links" section
3. Click "Add Link"
4. Enter title and URL
5. Done!

### Change Theme

In the Editor:
1. Scroll to "Theme & Customization"
2. Select from 6 premium themes
3. Customize primary color
4. Changes appear in live preview!

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow prompts and add your environment variables.

## Customization Ideas

### Own Colors

Edit `lib/themes.ts`:
```typescript
'my-theme': {
  primaryColor: '#YOUR_COLOR',
  // ... other colors
}
```

### New Theme

Copy an existing theme in `lib/themes.ts` and customize colors.

### Button Styles

Edit `getAllThemes()` in `lib/themes.ts` to change button appearance.

### Add Features

Check [DEVELOPMENT.md](./DEVELOPMENT.md) for how to:
- Add new pages
- Create components
- Database operations
- Extend the design

## Troubleshooting

### "Missing environment variables"
```bash
# Make sure you've copied and filled .env.local
cat .env.local  # Check all values are filled
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### "Firebase errors"

1. Check Firebase Console for:
   - Authentication is enabled
   - Firestore is created
   - Storage is enabled

2. Verify `.env.local` values match Firebase Console

### "Port 3000 in use"
```bash
# Use different port
npm run dev -- -p 3001
```

## Next Steps

1. 🎨 **Customize** your theme in `lib/themes.ts`
2. 🚀 **Deploy** to Vercel or your hosting
3. 📖 **Read** [DEVELOPMENT.md](./DEVELOPMENT.md) for extending
4. 💾 **Add** your own features!

## Resources

- 📚 [Full README](./README.md)
- 🔧 [Developer Guide](./DEVELOPMENT.md)
- 🔥 [Firebase Setup](./FIREBASE_SETUP.md)
- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind Docs](https://tailwindcss.com)

## Get Help

1. Check the docs above
2. Review code comments
3. Check browser console for errors
4. Review Firebase Console logs

## What's Included

✅ Complete authentication system
✅ Beautiful dashboard
✅ Advanced page editor
✅ 6 premium themes
✅ Real-time analytics
✅ Public profile pages
✅ Mobile responsive
✅ Database & storage

## Ready to Build?

```bash
npm run dev
```

Then visit http://localhost:3000 and start creating! 🚀

---

**Questions?** Check the docs or open an issue on GitHub.
