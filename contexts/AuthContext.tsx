'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/firebase';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Get user profile from database
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data && !error) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              username: data.username,
              displayName: data.display_name,
              bio: data.bio || '',
              profileImage: data.profile_image || '',
              createdAt: data.created_at,
              updatedAt: data.updated_at,
            });
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (data && !error) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: data.username,
            displayName: data.display_name,
            bio: data.bio || '',
            profileImage: data.profile_image || '',
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    username: string,
    displayName: string
  ) => {
    try {
      setLoading(true);

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase.from('user_profiles').insert([
          {
            id: data.user.id,
            email,
            username,
            display_name: displayName,
            bio: '',
            profile_image: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;

        // Create bio page profile
        const { error: pageError } = await supabase.from('bio_pages').insert([
          {
            user_id: data.user.id,
            username,
            display_name: displayName,
            bio: '',
            profile_image: '',
            links: [],
            theme: {
              name: 'dark-modern',
              primaryColor: '#a78bfa',
              secondaryColor: '#1e293b',
              accentColor: '#ec4899',
              backgroundColor: '#0f172a',
              textColor: '#f1f5f9',
              buttonStyle: 'rounded',
            },
            styles: {
              font: 'inter',
              buttonStyle: 'rounded',
              backgroundType: 'gradient',
              backgroundGradient: { from: '#0f172a', to: '#1e293b', angle: 135 },
              animatedBackground: false,
              primaryColor: '#a78bfa',
              accentColor: '#ec4899',
            },
            views: 0,
            total_clicks: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (pageError) throw pageError;
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
