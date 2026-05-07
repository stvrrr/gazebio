# Firebase Configuration Guide for Gazebio

This guide will walk you through setting up Firebase for the Gazebio application.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `gazebio` (or your preferred name)
4. Accept the terms and click **"Create project"**
5. Wait for the project to be created

## Step 2: Enable Authentication

1. In the Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. Select **Email/Password** method
4. Enable **Email/Password** authentication
5. Click **"Save"**

## Step 3: Create Firestore Database

1. Go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - Note: In production, update security rules
4. Select your preferred location
5. Click **"Create"**

## Step 4: Set Up Cloud Storage

1. Go to **Storage** (left sidebar)
2. Click **"Get started"**
3. Accept the default rules (for development)
4. Select the same location as Firestore
5. Click **"Done"**

## Step 5: Get Firebase Config

1. Go to **Project settings** (gear icon, top-left)
2. Scroll down to **"Your apps"** section
3. Click the **web icon** (</>) if not already added
4. Copy the config object

## Step 6: Set Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase config in `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 7: Set Firestore Security Rules (Development)

For development, you can use test mode. For production, replace the rules in the Firestore security tab with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users only
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Profiles collection - public read, authenticated write
    match /profiles/{profileId} {
      allow read: if true;
      allow write: if request.auth.uid == profileId;
    }
  }
}
```

## Step 8: Set Cloud Storage Rules (Development)

For development, you can use the default rules. For production:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profiles/{userId}/avatar {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

## Step 9: Test the Setup

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

5. Check Firebase Console:
   - Authentication tab should show your new user
   - Firestore should have created `users` and `profiles` collections

## Troubleshooting

### "Missing environment variables"
- Check that all variables in `.env.local` are filled
- Restart the dev server after updating `.env.local`

### "Permission denied" errors
- Check Firestore and Storage security rules
- For development, use permissive rules in test mode
- Verify the user is authenticated

### "Database not initialized"
- Go to Firestore Database in Firebase Console
- Click "Create Database"
- Select "Start in test mode"

### "Storage bucket not found"
- Go to Storage in Firebase Console
- Click "Get started"
- Follow the setup wizard

## Next Steps

1. Customize the theme presets in `lib/themes.ts`
2. Add your branding and colors
3. Deploy to Vercel
4. Update Firestore rules for production security

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js with Firebase Guide](https://nextjs.org/docs/getting-started)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Support

If you encounter issues:

1. Check the Firebase Console logs
2. Verify all environment variables are set correctly
3. Check browser console for error messages
4. Review Firestore security rules
5. Ensure Firestore and Storage are enabled
