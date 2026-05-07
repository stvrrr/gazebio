'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getProfileByUsername, recordProfileView, recordLinkClick } from '@/lib/db';
import { UserProfile } from '@/types';
import { Loader } from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await getProfileByUsername(username);
      if (profileData) {
        setProfile(profileData);
        // Record view
        await recordProfileView(profileData.userId);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = async (linkId: string, url: string) => {
    if (profile) {
      await recordLinkClick(profile.userId, linkId);
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-glow-purple" size={40} />
          <p className="text-glass-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-glass-light">
            {error || 'The profile you are looking for does not exist.'}
          </p>
        </div>
      </div>
    );
  }

  const theme = profile.theme;

  const getButtonClassName = () => {
    const baseClasses =
      'w-full py-3 px-6 font-medium transition-all duration-300 animate-fade-in-up';
    const styleClasses: Record<string, string> = {
      rounded: 'rounded-lg hover:scale-105 hover:shadow-lg',
      pill: 'rounded-full hover:scale-105 hover:shadow-lg',
      glow: `rounded-lg shadow-glow hover:shadow-glow hover:scale-110 animate-glow-pulse`,
      glass: 'rounded-lg backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105',
    };

    return `${baseClasses} ${styleClasses[theme.buttonStyle] || styleClasses.rounded}`;
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background:
          theme.backgroundType === 'gradient'
            ? `linear-gradient(${theme.backgroundGradient?.angle || 135}deg, ${theme.backgroundColor}, ${theme.backgroundGradient?.to || theme.backgroundColor})`
            : theme.backgroundColor,
      }}
    >
      <div className="w-full max-w-md">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-12 animate-fade-in-up">
          {/* Profile Image */}
          <div
            className="w-32 h-32 rounded-full p-1 mb-6 shadow-lg"
            style={{ background: theme.primaryColor }}
          >
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt={profile.displayName}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
                priority
              />
            ) : (
              <div className="w-full h-full bg-white/10 flex items-center justify-center text-5xl font-bold rounded-full text-white">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold text-white mb-3 text-center">
            {profile.displayName}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p
              className="text-center text-lg mb-8 max-w-sm leading-relaxed"
              style={{ color: theme.textColor }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3 mb-12">
          {profile.links && profile.links.length > 0 ? (
            profile.links.map((link, idx) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className={getButtonClassName()}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.textColor,
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                {link.title}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-white/50">
              <p>No links available yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-white/40 text-sm">
          <p className="animate-fade-in">
            ✨ Made with{' '}
            <a href="/" className="text-glow-purple hover:text-glow-purple/80">
              Gazebio
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
