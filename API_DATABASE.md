# Gazebio API & Database Documentation

## Database Schema

### Firestore Collections

#### Users Collection
Stores user account information and authentication details.

```typescript
/users/{userId}
{
  email: string;              // User's email address
  username: string;           // Unique username
  displayName: string;        // Display name
  bio: string;               // User bio (optional)
  profileImage: string;      // URL to profile image
  createdAt: ISO8601;        // Account creation timestamp
  updatedAt: ISO8601;        // Last update timestamp
}
```

**Indexes**: 
- `username` (for lookups)
- `email` (for auth)

---

#### Profiles Collection
Stores all profile customization and link data.

```typescript
/profiles/{userId}
{
  userId: string;                    // Reference to user
  username: string;                  // Username for public URL
  displayName: string;               // Display name
  bio: string;                       // User bio
  profileImage: string;              // Profile image URL
  
  // Links Array
  links: [
    {
      id: string;                    // Unique link ID
      title: string;                 // Link title/text
      url: string;                   // Target URL
      icon?: string;                 // Optional icon
      clicks: number;                // Click count
      order: number;                 // Display order
      createdAt: ISO8601;            // Link creation timestamp
    }
  ];
  
  // Theme Configuration
  theme: {
    name: string;                    // Theme name
    primaryColor: string;            // Primary color (hex)
    secondaryColor: string;          // Secondary color
    accentColor: string;             // Accent color
    backgroundColor: string;         // Background color
    backgroundImage?: string;        // Background image URL
    textColor: string;               // Text color
    buttonStyle: 'rounded'|'pill'|'glow'|'glass';
  };
  
  // Styling
  styles: {
    font: string;                    // Font family
    buttonStyle: 'rounded'|'pill'|'glow'|'glass';
    backgroundType: 'solid'|'gradient'|'image'|'animated';
    backgroundGradient?: {
      from: string;                  // Gradient start color
      to: string;                    // Gradient end color
      angle: number;                 // Gradient angle (0-360)
    };
    backgroundImage?: string;        // Background image URL
    animatedBackground?: boolean;    // Enable animation
    primaryColor: string;            // Primary color override
    accentColor: string;             // Accent color override
  };
  
  // Analytics
  views: number;                     // Total profile views
  totalClicks: number;               // Total link clicks
  
  // Metadata
  createdAt: ISO8601;               // Profile creation timestamp
  updatedAt: ISO8601;               // Last update timestamp
}
```

**Indexes**:
- `username` (for public lookups)
- `views` (for popular profiles)
- `totalClicks` (for engagement ranking)

---

### Cloud Storage Paths

```
profiles/
├── {userId}/
│   ├── avatar          // Profile image file
│   └── background      // Background image (optional, for future)
```

---

## Database Operations

### User Operations

#### Create User
```typescript
// Called during signup
await setDoc(doc(db, 'users', userId), {
  email,
  username,
  displayName,
  bio: '',
  profileImage: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```

#### Get User
```typescript
const userDoc = await getDoc(doc(db, 'users', userId));
const user = userDoc.data();
```

#### Update User
```typescript
await updateDoc(doc(db, 'users', userId), {
  displayName,
  bio,
  profileImage,
  updatedAt: new Date().toISOString(),
});
```

---

### Profile Operations

#### Create Profile
```typescript
// Called during signup
await setDoc(doc(db, 'profiles', userId), {
  userId,
  username,
  displayName,
  bio: '',
  profileImage: '',
  links: [],
  theme: defaultTheme,
  styles: defaultStyles,
  views: 0,
  totalClicks: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```

#### Get Profile
```typescript
const profile = await getDoc(doc(db, 'profiles', userId));
return profile.data() as UserProfile;
```

#### Get Profile by Username
```typescript
const q = query(
  collection(db, 'profiles'),
  where('username', '==', username)
);
const docs = await getDocs(q);
return docs.docs[0]?.data() as UserProfile;
```

#### Update Profile
```typescript
await updateDoc(doc(db, 'profiles', userId), {
  displayName,
  bio,
  updatedAt: new Date().toISOString(),
  // ... other fields
});
```

---

### Link Operations

#### Add Link
```typescript
const link: Link = {
  id: generateId(),
  title,
  url,
  clicks: 0,
  order: profile.links.length,
  createdAt: new Date().toISOString(),
};

const profile = await getDoc(doc(db, 'profiles', userId));
await updateDoc(doc(db, 'profiles', userId), {
  links: [...profile.data().links, link],
  updatedAt: new Date().toISOString(),
});
```

#### Update Link
```typescript
const profile = await getDoc(doc(db, 'profiles', userId));
const updatedLinks = profile.data().links.map((link) =>
  link.id === linkId ? { ...link, ...updates } : link
);
await updateDoc(doc(db, 'profiles', userId), {
  links: updatedLinks,
  updatedAt: new Date().toISOString(),
});
```

#### Delete Link
```typescript
const profile = await getDoc(doc(db, 'profiles', userId));
const filteredLinks = profile.data().links.filter(
  (link) => link.id !== linkId
);
await updateDoc(doc(db, 'profiles', userId), {
  links: filteredLinks,
  updatedAt: new Date().toISOString(),
});
```

#### Reorder Links
```typescript
await updateDoc(doc(db, 'profiles', userId), {
  links: reorderedLinks,
  updatedAt: new Date().toISOString(),
});
```

---

### Analytics Operations

#### Record Profile View
```typescript
const profile = await getDoc(doc(db, 'profiles', userId));
const currentViews = profile.data().views || 0;
await updateDoc(doc(db, 'profiles', userId), {
  views: currentViews + 1,
});
```

#### Record Link Click
```typescript
const profile = await getDoc(doc(db, 'profiles', userId));
const updatedLinks = profile.data().links.map((link) =>
  link.id === linkId 
    ? { ...link, clicks: (link.clicks || 0) + 1 } 
    : link
);
const totalClicks = updatedLinks.reduce(
  (sum, link) => sum + (link.clicks || 0),
  0
);
await updateDoc(doc(db, 'profiles', userId), {
  links: updatedLinks,
  totalClicks,
});
```

---

### Storage Operations

#### Upload Profile Image
```typescript
const fileRef = ref(storage, `profiles/${userId}/avatar`);
await uploadBytes(fileRef, file);
const imageUrl = await getDownloadURL(fileRef);

// Update profile with image URL
await updateDoc(doc(db, 'profiles', userId), {
  profileImage: imageUrl,
});
```

#### Delete Profile Image
```typescript
const fileRef = ref(storage, `profiles/${userId}/avatar`);
await deleteObject(fileRef);
```

---

## Queries

### Get Popular Profiles
```typescript
const q = query(
  collection(db, 'profiles'),
  orderBy('views', 'desc'),
  limit(10)
);
const docs = await getDocs(q);
```

### Get Trending Links
```typescript
const q = query(
  collection(db, 'profiles'),
  orderBy('totalClicks', 'desc'),
  limit(10)
);
const docs = await getDocs(q);
```

### Get Recent Profiles
```typescript
const q = query(
  collection(db, 'profiles'),
  orderBy('createdAt', 'desc'),
  limit(20)
);
const docs = await getDocs(q);
```

---

## Security Rules

### Firestore Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /profiles/{profileId} {
      allow read: if true;
      allow write: if request.auth.uid == profileId;
    }
  }
}
```

### Firestore Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - only own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Profiles - public read, authenticated write
    match /profiles/{profileId} {
      allow read: if true;
      allow create: if request.auth != null && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth.uid == profileId;
    }
  }
}
```

### Storage Rules
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

---

## State Management (Zustand)

### Profile Store Structure
```typescript
interface ProfileStore {
  profile: UserProfile | null;
  loading: boolean;
  
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  addLink: (link: Link) => void;
  updateLink: (linkId: string, updates: Partial<Link>) => void;
  deleteLink: (linkId: string) => void;
  reorderLinks: (links: Link[]) => void;
  
  setTheme: (theme: Theme) => void;
  setStyles: (styles: StyleSettings) => void;
  
  setLoading: (loading: boolean) => void;
  reset: () => void;
}
```

### Usage in Components
```typescript
const { profile, addLink, setTheme } = useProfileStore();
```

---

## Future Extensions

### Addition: User Followers/Following
```typescript
/users/{userId}/followers: [userId1, userId2, ...]
/users/{userId}/following: [userId1, userId2, ...]
```

### Addition: Comments/Reviews
```typescript
/profiles/{userId}/reviews: [
  {
    authorId: string;
    rating: 1-5;
    text: string;
    createdAt: ISO8601;
  }
]
```

### Addition: Premium Features
```typescript
/users/{userId}/subscription: {
  plan: 'free' | 'pro' | 'premium';
  status: 'active' | 'inactive';
  endsAt: ISO8601;
  customDomain?: string;
  customCSSAllowed: boolean;
}
```

### Addition: Custom Domains
```typescript
/customDomains: {
  domain: string;
  userId: string;
  verified: boolean;
  verifiedAt?: ISO8601;
}
```

---

## Data Validation

### Username Validation
- Length: 3-30 characters
- Format: lowercase, alphanumeric, dash, underscore
- Unique: no duplicates allowed

### URL Validation
- Must be valid HTTP/HTTPS URL
- Must include protocol (http:// or https://)

### Email Validation
- Valid email format
- Used for authentication

### Image Upload
- Max size: 5MB (configurable)
- Formats: JPG, PNG, WebP, GIF
- Stored in Cloud Storage

---

## Rate Limiting (Recommended for Production)

```typescript
// Implement rate limiting for:
// - Profile views (per IP)
// - Link clicks (per IP)
// - API calls (per user)
```

---

## Monitoring & Logging

### Key Metrics to Track
- Total users
- Active users
- Average links per profile
- Popular themes
- Most clicked links
- Profile views distribution

### Errors to Log
- Authentication failures
- Database write failures
- Storage upload failures
- Permission denied errors

---

## Pagination (for Future Lists)

```typescript
const pageSize = 10;
const q = query(
  collection(db, 'profiles'),
  orderBy('createdAt', 'desc'),
  startAfter(lastDoc),
  limit(pageSize)
);
const docs = await getDocs(q);
```

---

## Batch Operations (for Performance)

```typescript
const batch = writeBatch(db);

batch.set(doc(db, 'users', userId), userData);
batch.set(doc(db, 'profiles', userId), profileData);

await batch.commit();
```

---

## Real-time Listeners (for Updates)

```typescript
// Subscribe to profile changes
const unsubscribe = onSnapshot(
  doc(db, 'profiles', userId),
  (doc) => {
    console.log('Profile updated:', doc.data());
  }
);

// Unsubscribe when done
unsubscribe();
```

---

## Performance Optimization Tips

1. **Denormalize** common queries in `profiles` collection
2. **Batch writes** when updating multiple documents
3. **Use indexes** for common queries
4. **Paginate** large lists
5. **Cache** profiles in state management
6. **Use Cloud Functions** for complex operations (future)

---

## Backup & Recovery

- Firestore automatically backs up data
- Configure export schedules in Firebase Console
- Store backups in Cloud Storage
- Test restore process periodically

---

For API requests, all operations are server-side with Firestore. Add Express endpoints in `api/` folder for future backend features.
