# Development Guide for Gazebio

A comprehensive guide for developers to understand, extend, and contribute to Gazebio.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with React (app directory)
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand (lightweight & performant)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **UI Components**: Lucide React icons
- **Notifications**: React Hot Toast

### Project Structure

```
gazebio/
├── app/                      # Next.js app directory (file-based routing)
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (/)
│   ├── (auth)/              # Auth routes group
│   │   ├── signup/          # /signup
│   │   └── login/           # /login
│   ├── dashboard/           # /dashboard
│   ├── editor/              # /editor
│   ├── settings/            # /settings
│   └── [username]/          # /[username] - public profile
│
├── components/              # Reusable React components
│   ├── UI Components        # Base components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── Layout              # Layout components
│   │   └── Navigation.tsx
│   ├── Auth                # Authentication components
│   │   ├── SignUpForm.tsx
│   │   └── SignInForm.tsx
│   ├── Dashboard           # Dashboard components
│   │   ├── StatsOverview.tsx
│   │   ├── QuickActions.tsx
│   │   └── AnalyticsPreview.tsx
│   └── Editor              # Editor components
│       ├── ProfileEditor.tsx
│       ├── LinkEditor.tsx
│       ├── ThemeEditor.tsx
│       └── LivePreview.tsx
│
├── contexts/               # React Context
│   └── AuthContext.tsx     # Authentication context and provider
│
├── lib/                    # Utility functions and services
│   ├── firebase.ts         # Firebase initialization
│   ├── db.ts              # Database operations (CRUD)
│   ├── themes.ts          # Theme presets and utilities
│   └── utils.ts           # Helper functions (validation, formatting, etc.)
│
├── store/                 # Zustand state management
│   └── profileStore.ts    # Profile state
│
├── types/                 # TypeScript type definitions
│   └── index.ts
│
├── styles/                # Global styles
│   └── globals.css
│
├── hooks/                 # Custom React hooks
│   └── useProtectedRoute.ts
│
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── .env.local.example     # Environment variables template
```

## Adding a New Feature

### 1. Add New Page

Create a new route in the `app/` directory:

```typescript
// app/newpage/page.tsx
import { useAuth } from '@/contexts/AuthContext';

export default function NewPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-white">New Page</h1>
    </div>
  );
}
```

### 2. Create a New Component

```typescript
// components/MyComponent.tsx
'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <Button variant="primary" onClick={onAction}>
        Action
      </Button>
    </Card>
  );
};
```

### 3. Add Database Operations

Update `lib/db.ts`:

```typescript
export const newOperation = async (userId: string, data: any): Promise<void> => {
  try {
    const docRef = doc(db, 'collection', userId);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### 4. Update State Management

Extend `store/profileStore.ts`:

```typescript
interface ProfileStore {
  // ... existing
  newField: any;
  
  setNewField: (value: any) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  // ... existing
  newField: null,
  
  setNewField: (value) => set({ newField: value }),
}));
```

## Extending the Design System

### Adding a New Theme

Edit `lib/themes.ts`:

```typescript
export const THEME_PRESETS: Record<string, Theme> = {
  // ... existing themes
  'my-theme': {
    name: 'my-theme',
    primaryColor: '#FF1493',
    secondaryColor: '#1a1a2e',
    accentColor: '#00BFFF',
    backgroundColor: '#0a0a15',
    textColor: '#ffffff',
    buttonStyle: 'rounded',
  },
};
```

### Adding Button Variant

Update `components/Button.tsx`:

```typescript
const variantStyles = {
  // ... existing
  'my-variant': 'bg-blue-600 hover:bg-blue-700 text-white',
};
```

### Custom Tailwind Classes

Add to `tailwind.config.js`:

```typescript
extend: {
  colors: {
    'my-color': '#ABC123',
  },
  animation: {
    'my-animation': 'myAnimation 1s ease-in-out',
  },
}
```

## Running Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production build
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Testing

Currently, Gazebio doesn't have configured tests. To add testing:

1. Install dependencies:
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. Create `jest.config.js`

3. Create tests in `__tests__/` directories parallel to source

Create a test file:
```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Performance Optimization

### Image Optimization

Always use Next.js `Image` component:

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={200}
  height={200}
  priority // for above-the-fold images
/>
```

### Code Splitting

Next.js automatically code-splits routes. For dynamic imports:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

### Caching

Use React's `useCallback` and `useMemo` for expensive computations:

```typescript
const memoizedValue = useMemo(() => expensiveComputation(), [dependency]);
const memoizedCallback = useCallback(() => {
  doSomething();
}, [dependency]);
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Other Platforms

Ensure you have:
- `npm run build` command working
- `npm start` command working
- Environment variables configured
- Node.js 18+ runtime

## Error Handling

Always wrap async operations in try-catch:

```typescript
try {
  // operation
  toast.success('Success!');
} catch (error: any) {
  console.error('Error:', error);
  toast.error(error.message || 'An error occurred');
}
```

Use proper error types:

```typescript
if (error instanceof FirebaseError) {
  // Handle Firebase specific error
}
```

## Security Best Practices

1. **Never expose secrets**: Keep all API keys in `.env.local`
2. **Validate input**: Always validate user input before sending to database
3. **Firestore rules**: Set proper security rules in production
4. **Authentication**: Check auth state before allowing operations
5. **CORS**: Configure CORS headers for cross-origin requests if needed

## Debugging

### Enable Debug Mode

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info');
}
```

### Browser DevTools

- Use React DevTools extension
- Check Network tab for API calls
- Use Console for error messages

### Firebase Console

- Check Authentication logs
- Review Firestore read/write operations
- Monitor Storage access

## Common Issues

### Hydration Mismatch

Ensure components are marked with `'use client'` when using browser APIs:

```typescript
'use client';

import React, { useEffect } from 'react';

export const Component = () => {
  useEffect(() => {
    // Browser only code
  }, []);
  
  return <div>{/*content*/}</div>;
};
```

### Build Errors

1. Check TypeScript errors: `npm run type-check`
2. Clear cache: `rm -rf .next && npm run build`
3. Check peer dependencies: `npm install`

### Runtime Errors

1. Check browser console for errors
2. Check server logs (terminal)
3. Verify environment variables
4. Check Firebase configuration

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Test locally
4. Commit: `git commit -am 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Create Pull Request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## Support

For development questions:
1. Check existing documentation
2. Review code comments
3. Check Firebase/Next.js docs
4. Open an issue on GitHub
