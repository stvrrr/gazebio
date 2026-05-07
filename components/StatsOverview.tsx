'use client';

import React from 'react';
import { StatCard } from '@/components/Card';
import { Eye, Link as LinkIcon, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

interface StatsOverviewProps {
  profile: UserProfile;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ profile }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        icon={<Eye />}
        label="Profile Views"
        value={profile.views || 0}
      />
      <StatCard
        icon={<LinkIcon />}
        label="Total Link Clicks"
        value={profile.totalClicks || 0}
      />
      <StatCard
        icon={<Sparkles />}
        label="Links"
        value={profile.links?.length || 0}
      />
    </div>
  );
};
