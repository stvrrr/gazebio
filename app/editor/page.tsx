'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileStore } from '@/store/profileStore';
import { getUserProfile } from '@/lib/db';
import { ProfileEditor } from '@/components/ProfileEditor';
import { LinkEditor } from '@/components/LinkEditor';
import { ThemeEditor } from '@/components/ThemeEditor';
import { LivePreview } from '@/components/LivePreview';
import { Card } from '@/components/Card';
import { Loader } from 'lucide-react';

export default function EditorPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { profile, setProfile, setLoading } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        loadProfile();
      }
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const profileData = await getUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-glow-purple" size={40} />
          <p className="text-glass-light">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Page Editor</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Editor */}
          <div className="space-y-6">
            <ProfileEditor profile={profile} />
            <LinkEditor profile={profile} />
            <ThemeEditor profile={profile} />
          </div>

          {/* Right: Live Preview */}
          <div className="sticky top-24 h-fit">
            <Card className="overflow-hidden border-2 border-glow-purple/30">
              <div
                className="h-96"
                style={{
                  background: `linear-gradient(${
                    profile.theme.backgroundGradient?.angle || 135
                  }deg, ${profile.theme.backgroundColor}, ${
                    profile.theme.backgroundGradient?.to || profile.theme.backgroundColor
                  })`,
                }}
              >
                <LivePreview profile={profile} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
