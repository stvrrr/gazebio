'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileStore } from '@/store/profileStore';
import { getUserProfile } from '@/lib/db';
import { StatsOverview } from '@/components/StatsOverview';
import { QuickActions } from '@/components/QuickActions';
import { AnalyticsPreview } from '@/components/AnalyticsPreview';
import { Card } from '@/components/Card';
import { Loader } from 'lucide-react';

export default function DashboardPage() {
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
          <p className="text-glass-light">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.displayName}! 👋
          </h1>
          <p className="text-glass-light">
            Your bio page is live at <span className="text-glow-purple font-semibold">{process.env.NEXT_PUBLIC_APP_URL}/{user?.username}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsOverview profile={profile} />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Analytics */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalyticsPreview profile={profile} />
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {profile.links && profile.links.length > 0 ? (
                profile.links
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                  )
                  .slice(0, 5)
                  .map((link) => (
                    <div key={link.id} className="pb-4 border-b border-glass-light/10 last:border-0">
                      <p className="text-sm text-white truncate">{link.title}</p>
                      <p className="text-xs text-glass-light/50 mt-1">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-glass-light text-center py-4">No activity yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
