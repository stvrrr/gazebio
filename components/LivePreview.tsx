'use client';

import React from 'react';
import Image from 'next/image';
import { UserProfile } from '@/types';
import { GlassCard } from '@/components/Card';
import { Eye } from 'lucide-react';

interface LivePreviewProps {
  profile: UserProfile;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ profile }) => {
  const theme = profile.theme;

  const getButtonClassName = () => {
    const baseClasses = 'w-full py-3 rounded-lg font-medium transition-all duration-300';
    const styleClasses: Record<string, string> = {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
      glow: 'rounded-lg shadow-lg hover:shadow-glow-pink',
      glass: 'backdrop-blur-md bg-white/10 border border-white/20',
    };

    return `${baseClasses} ${styleClasses[theme.buttonStyle] || styleClasses.rounded}`;
  };

  return (
    <div
      className="min-h-full rounded-2xl overflow-hidden flex flex-col items-center justify-start pt-8 px-4"
      style={{
        background:
          theme.backgroundType === 'gradient'
            ? `linear-gradient(${theme.backgroundGradient?.angle || 135}deg, ${theme.backgroundColor}, ${theme.backgroundGradient?.to || theme.backgroundColor})`
            : theme.backgroundColor,
      }}
    >
      {/* Preview Header */}
      <div className="flex items-center gap-2 mb-6 text-white text-sm">
        <Eye size={16} />
        <span>Live Preview</span>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Profile Image */}
        <div className="w-24 h-24 rounded-full p-1 mb-4" style={{ background: theme.primaryColor }}>
          {profile.profileImage ? (
            <Image
              src={profile.profileImage}
              alt={profile.displayName}
              width={96}
              height={96}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-white/10 flex items-center justify-center text-2xl font-bold rounded-full text-white">
              {profile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name and Bio */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">
          {profile.displayName}
        </h1>
        {profile.bio && (
          <p className="text-center text-white/70 text-sm max-w-xs mb-6">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Links */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        {profile.links && profile.links.length > 0 ? (
          profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={getButtonClassName()}
              style={{
                backgroundColor: theme.primaryColor,
                color: 'white',
              }}
            >
              {link.title}
            </a>
          ))
        ) : (
          <div className="text-center text-white/50 py-8">
            <p className="text-sm">Links will appear here</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-white/40 text-xs">
        <p>Powered by Gazebio ✨</p>
      </div>
    </div>
  );
};
