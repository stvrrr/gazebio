import { create } from 'zustand';
import { UserProfile, Theme, StyleSettings, Link } from '@/types';

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

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,
  
  setProfile: (profile) => set({ profile }),
  
  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates, updatedAt: new Date().toISOString() } : null,
    })),
  
  addLink: (link) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            links: [...state.profile.links, link],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  updateLink: (linkId, updates) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            links: state.profile.links.map((link) =>
              link.id === linkId ? { ...link, ...updates } : link
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  deleteLink: (linkId) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            links: state.profile.links.filter((link) => link.id !== linkId),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  reorderLinks: (links) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            links,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  setTheme: (theme) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            theme,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  setStyles: (styles) =>
    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            styles,
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  
  setLoading: (loading) => set({ loading }),
  
  reset: () => set({ profile: null, loading: false }),
}));
