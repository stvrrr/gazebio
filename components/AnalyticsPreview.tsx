'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { UserProfile } from '@/types';
import { BarChart3 } from 'lucide-react';

interface AnalyticsPreviewProps {
  profile: UserProfile;
}

export const AnalyticsPreview: React.FC<AnalyticsPreviewProps> = ({ profile }) => {
  const topLink = profile.links?.reduce((max, link) =>
    (link.clicks || 0) > (max.clicks || 0) ? link : max
  );

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-glow-purple" size={24} />
        <h3 className="text-xl font-semibold text-white">Link Performance</h3>
      </div>

      {profile.links && profile.links.length > 0 ? (
        <div className="space-y-4">
          {profile.links
            .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
            .slice(0, 5)
            .map((link) => {
              const percentage =
                topLink && topLink.clicks
                  ? ((link.clicks || 0) / topLink.clicks) * 100
                  : 0;

              return (
                <div key={link.id}>
                  <div className="flex justify-between mb-1">
                    <p className="text-sm text-glass-light truncate">{link.title}</p>
                    <p className="text-sm font-semibold text-glow-pink">
                      {link.clicks || 0}
                    </p>
                  </div>
                  <div className="w-full h-2 bg-glass-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-glow-purple to-glow-pink transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-glass-light text-center py-8">
          No links yet. Create your first link to see analytics!
        </p>
      )}
    </Card>
  );
};
