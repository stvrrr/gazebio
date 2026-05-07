export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  clicks: number;
  order: number;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  bio: string;
  profileImage: string;
  links: Link[];
  theme: Theme;
  styles: StyleSettings;
  views: number;
  totalClicks: number;
  createdAt: string;
  updatedAt: string;
}

export type ThemeType = 'minimal-light' | 'dark-modern' | 'neon-gamer' | 'cyberpunk-glow' | 'soft-aesthetic' | 'gradient-glass';

export interface Theme {
  name: ThemeType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  textColor: string;
  buttonStyle: 'rounded' | 'pill' | 'glow' | 'glass';
}

export interface StyleSettings {
  font: 'inter' | 'space-mono' | 'poppins' | 'dm-sans';
  buttonStyle: 'rounded' | 'pill' | 'glow' | 'glass';
  backgroundType: 'solid' | 'gradient' | 'image' | 'animated';
  backgroundGradient?: {
    from: string;
    to: string;
    angle: number;
  };
  backgroundImage?: string;
  animatedBackground?: boolean;
  primaryColor: string;
  accentColor: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
