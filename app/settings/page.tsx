'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Settings as SettingsIcon, Lock, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

export default function SettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-glow-purple" size={40} />
          <p className="text-glass-light">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="text-glow-purple" size={32} />
          <h1 className="text-3xl font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Account Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-glass-light">Email</label>
                <p className="text-white mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-glass-light">Username</label>
                <p className="text-white mt-1">@{user?.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-glass-light">Display Name</label>
                <p className="text-white mt-1">{user?.displayName}</p>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="text-glow-purple" size={24} />
              <h3 className="text-lg font-semibold text-white">Security</h3>
            </div>
            <p className="text-glass-light text-sm mb-4">
              Manage your account security and authentication settings.
            </p>
            <Button variant="secondary" className="w-full">
              Change Password
            </Button>
          </Card>

          {/* Account Deletion */}
          <Card className="p-6 border-red-500/30">
            <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
            <p className="text-glass-light text-sm mb-4">
              Delete your account and all associated data permanently.
            </p>
            <Button variant="danger" className="w-full">
              Delete Account
            </Button>
          </Card>

          {/* Sign Out */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <LogOut className="text-glow-purple" size={24} />
              <h3 className="text-lg font-semibold text-white">Session</h3>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
