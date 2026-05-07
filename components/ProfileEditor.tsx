'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Input, TextArea } from '@/components/Input';
import { Button } from '@/components/Button';
import { UserProfile } from '@/types';
import { useProfileStore } from '@/store/profileStore';
import { uploadProfileImage, updateUserProfile } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card } from '@/components/Card';

interface ProfileEditorProps {
  profile: UserProfile;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { updateProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const imageUrl = await uploadProfileImage(user.id, file);
      await updateUserProfile(user.id, { profileImage: imageUrl });
      updateProfile({ profileImage: imageUrl });
      toast.success('Profile image updated!');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user.id, {
        displayName: profile.displayName,
        bio: profile.bio,
      });
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Profile Settings</h3>

      <div className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-glass-light mb-3">
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-glow-purple to-glow-pink p-1 overflow-hidden">
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.displayName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-glass-dark flex items-center justify-center text-glow-purple text-2xl font-bold rounded-full">
                  {profile.displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isUploading}
              >
                <Upload size={16} className="mr-2" />
                Upload
              </Button>
            </div>
          </div>
        </div>

        {/* Display Name */}
        <Input
          label="Display Name"
          value={profile.displayName}
          onChange={(e) => updateProfile({ displayName: e.target.value })}
          placeholder="Your Name"
        />

        {/* Bio */}
        <TextArea
          label="Bio"
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          placeholder="Tell visitors about yourself..."
          rows={4}
        />

        {/* Save Button */}
        <Button
          variant="primary"
          className="w-full"
          onClick={handleSave}
          isLoading={isLoading}
        >
          Save Changes
        </Button>
      </div>
    </Card>
  );
};
