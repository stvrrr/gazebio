# Supabase Configuration Guide for Gazebio

This guide will walk you through setting up Supabase for the Gazebio application.

## Step 1: Create a Supabase Project

1. Go to [Supabase Console](https://app.supabase.com)
2. Sign up or log in
3. Click **"New Project"**
4. Enter project name: `gazebio` (or your preferred name)
5. Create a strong database password
6. Select your region (closest to your users)
7. Click **"Create new project"** and wait for initialization

## Step 2: Create Database Tables

Once your project is ready, go to the **SQL Editor** and run these queries to create the necessary tables:

### Create User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_username ON user_profiles(username);
```

### Create Bio Pages Table (Main Profile Data)
```sql
CREATE TABLE bio_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  profile_image TEXT,
  links JSONB DEFAULT '[]'::jsonb,
  theme JSONB DEFAULT '{
    "name": "dark-modern",
    "primaryColor": "#a78bfa",
    "secondaryColor": "#1e293b",
    "accentColor": "#ec4899",
    "backgroundColor": "#0f172a",
    "textColor": "#f1f5f9",
    "buttonStyle": "rounded"
  }'::jsonb,
  styles JSONB DEFAULT '{
    "font": "inter",
    "buttonStyle": "rounded",
    "backgroundType": "gradient",
    "backgroundGradient": {"from": "#0f172a", "to": "#1e293b", "angle": 135},
    "animatedBackground": false,
    "primaryColor": "#a78bfa",
    "accentColor": "#ec4899"
  }'::jsonb,
  views INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bio_pages_username ON bio_pages(username);
CREATE INDEX idx_bio_pages_user_id ON bio_pages(user_id);
CREATE INDEX idx_bio_pages_views ON bio_pages(views DESC);
CREATE INDEX idx_bio_pages_total_clicks ON bio_pages(total_clicks DESC);
```

## Step 3: Enable Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. Go to **URL Configuration**
4. Add your app URL to **Redirect URLs**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
5. Click **Save**

## Step 4: Setup Row Level Security (RLS)

Enable RLS on your tables for security:

### Enable RLS
```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bio_pages ENABLE ROW LEVEL SECURITY;
```

### Set RLS Policies for user_profiles

```sql
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Set RLS Policies for bio_pages

```sql
-- Everyone can read bio pages (public profiles)
CREATE POLICY "Bio pages are public" ON bio_pages
  FOR SELECT USING (true);

-- Users can only update their own bio page
CREATE POLICY "Users can update own bio page" ON bio_pages
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own bio page
CREATE POLICY "Users can insert own bio page" ON bio_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bio page
CREATE POLICY "Users can delete own bio page" ON bio_pages
  FOR DELETE USING (auth.uid() = user_id);
```

## Step 5: Setup Cloud Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name it: `profile-images`
4. Make it **Public** (for image viewing)
5. Click **Create bucket**

### Set Storage Policies

Go to the bucket and set these policies:

#### Bucket Policies

1. Click the bucket → **Policies**
2. Add a policy for public read:
   ```sql
   CREATE POLICY "Public Access" ON storage.objects
     FOR SELECT USING (bucket_id = 'profile-images');
   ```

3. Add a policy for authenticated uploads:
   ```sql
   CREATE POLICY "Authenticated users can upload" ON storage.objects
     FOR INSERT WITH CHECK (
       bucket_id = 'profile-images' AND
       auth.role() = 'authenticated'
     );
   ```

4. Add a policy for users to delete their own files:
   ```sql
   CREATE POLICY "Users can delete own files" ON storage.objects
     FOR DELETE USING (
       bucket_id = 'profile-images' AND
       auth.uid()::text = owner
     );
   ```

## Step 6: Get Your Credentials

1. Go to **Project Settings** (gear icon)
2. Go to **API** tab
3. Copy your **Project URL** (under "API URL")
4. Copy your **Public API Key** (under "anon public")

These are your Supabase credentials.

## Step 7: Set Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 8: Test the Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Navigate to `http://localhost:3000`

4. Try signing up with an email and password

5. Check Supabase Console:
   - **Authentication** tab should show your new user
   - **SQL Editor** → query `SELECT * FROM user_profiles;` should show your user
   - **SQL Editor** → query `SELECT * FROM bio_pages;` should show your bio page

## Troubleshooting

### "Missing environment variables"
- Check that both Supabase variables in `.env.local` are filled
- Restart the dev server after updating `.env.local`

### "Permission denied" errors
- Check RLS policies are correctly set
- Verify the user is authenticated
- Run the RLS policy SQL queries in SQL Editor

### "Table does not exist"
- Run the table creation SQL queries in the SQL Editor
- Make sure you're in the correct database

### "Failed to upload image"
- Check the `profile-images` bucket exists
- Check Storage policies are set correctly
- Verify bucket is set to Public

### "Cannot sign up"
- Check Email authentication is enabled
- Verify Redirect URLs are configured
- Check user doesn't already exist

## SQL Management Commands

### View all tables
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

### View table structure
```sql
\d user_profiles
\d bio_pages
```

### Check RLS policies
```sql
SELECT * FROM pg_policies;
```

### Clear all data (careful!)
```sql
TRUNCATE bio_pages CASCADE;
TRUNCATE user_profiles CASCADE;
```

## Next Steps

1. Customize the theme presets in `lib/themes.ts`
2. Add your branding and colors
3. Deploy to Vercel
4. Update environment variables in production

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security)

## Support

If you encounter issues:

1. Check the Supabase Console logs
2. Verify all environment variables are set correctly
3. Check browser console for error messages
4. Review RLS policies
5. Run the SQL queries to verify table structure
6. Visit [Supabase Discord](https://discord.supabase.com) for community support
