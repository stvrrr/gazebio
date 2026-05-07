'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { UserProfile, Theme } from '@/types';
import { useProfileStore } from '@/store/profileStore';
import { THEME_PRESETS, getAllThemes } from '@/lib/themes';
import { updateUserProfile } from '@/lib/db';
import { useAuth } from '@/contexts/AuthContext';
import { Palette } from 'lucide-react';
import toast from 'react-hot-toast';

interface ThemeEditorProps {
  profile: UserProfile;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ profile }) => {
  const { user } = useAuth();
  const { setTheme } = useProfileStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const applyTheme = async (theme: Theme) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateUserProfile(user.id, { theme });
      setTheme(theme);
      toast.success(`Applied ${theme.name} theme!`);
    } catch (error) {
      toast.error('Failed to apply theme');
    } finally {
      setIsLoading(false);
    }
  };

  const updatePrimaryColor = async (color: string) => {
    if (!user) return;

    const updatedTheme = { ...profile.theme, primaryColor: color };
    setIsLoading(true);
    try {
      await updateUserProfile(user.id, { theme: updatedTheme });
      setTheme(updatedTheme);
    } catch (error) {
      toast.error('Failed to update color');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="text-glow-purple" size={24} />
        <h3 className="text-lg font-semibold text-white">Theme & Customization</h3>
      </div>

      <div className="space-y-6">
        {/* Theme Presets */}
        <div>
          <label className="block text-sm font-medium text-glass-light mb-3">
            Premium Themes
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getAllThemes().map((theme) => (
              <button
                key={theme.name}
                onClick={() => applyTheme(theme)}
                disabled={isLoading}
                className={`p-3 rounded-lg border-2 transition-all ${
                  profile.theme.name === theme.name
                    ? 'border-glow-purple bg-glow-purple/10'
                    : 'border-glass-light/20 hover:border-glass-light/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: theme.primaryColor }}
                  />
                  <div
                    className="w-4 h-4 rounded"
                    style={{ background: theme.accentColor }}
                  />
                </div>
                <p className="text-xs font-medium text-white capitalize">
                  {theme.name.replace('-', ' ')}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-glass-light mb-3">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={profile.theme.primaryColor}
              onChange={(e) => updatePrimaryColor(e.target.value)}
              className="w-16 h-10 rounded-lg cursor-pointer"
            />
            <span className="text-sm text-glass-light">{profile.theme.primaryColor}</span>
          </div>
        </div>

        {/* Button Style */}
        <div>
          <label className="block text-sm font-medium text-glass-light mb-3">
            Button Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['rounded', 'pill', 'glow', 'glass'].map((style) => (
              <Button
                key={style}
                variant={profile.theme.buttonStyle === style ? 'primary' : 'secondary'}
                size="sm"
                className="capitalize"
                onClick={() => {
                  const updatedTheme = {
                    ...profile.theme,
                    buttonStyle: style as any,
                  };
                  applyTheme(updatedTheme);
                }}
              >
                {style}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
