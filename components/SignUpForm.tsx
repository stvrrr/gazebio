'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { GlassCard } from '@/components/Card';
import { Mail, Lock, User, AtSign } from 'lucide-react';
import toast from 'react-hot-toast';
import { sanitizeUsername, checkUsernameAvailable } from '@/lib/utils';
import { checkUsernameAvailable as checkDbUsernameAvailable } from '@/lib/db';

export const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    username: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [usernameCheckLoading, setUsernameCheckLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (!formData.displayName) newErrors.displayName = 'Display name is required';

    if (!formData.username) newErrors.username = 'Username is required';
    else if (formData.username.length < 3)
      newErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-z0-9_-]+$/.test(formData.username))
      newErrors.username = 'Username can only contain letters, numbers, _, and -';
    else if (!(await checkDbUsernameAvailable(formData.username)))
      newErrors.username = 'Username already taken';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeUsername(e.target.value);
    setFormData((prev) => ({ ...prev, username: sanitized }));

    if (sanitized.length >= 3) {
      setUsernameCheckLoading(true);
      try {
        const available = await checkDbUsernameAvailable(sanitized);
        setUsernameAvailable(available);
      } finally {
        setUsernameCheckLoading(false);
      }
    } else {
      setUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) return;

    setIsLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.username,
        formData.displayName
      );
      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Join Gazebio</h1>
          <p className="text-glass-light">Create your premium bio page in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Display Name"
            icon={<User size={20} className="text-glow-purple" />}
            placeholder="Your Name"
            value={formData.displayName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
            }
            error={errors.displayName}
          />

          <div>
            <Input
              label="Username"
              icon={<AtSign size={20} className="text-glow-purple" />}
              placeholder="yourname"
              value={formData.username}
              onChange={handleUsernameChange}
              error={errors.username}
              helperText={
                usernameCheckLoading
                  ? 'Checking availability...'
                  : usernameAvailable === true
                  ? '✓ Available'
                  : usernameAvailable === false
                  ? '✗ Already taken'
                  : 'Your public page URL'
              }
            />
          </div>

          <Input
            label="Email"
            type="email"
            icon={<Mail size={20} className="text-glow-purple" />}
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            icon={<Lock size={20} className="text-glow-purple" />}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, password: e.target.value }))
            }
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={<Lock size={20} className="text-glow-purple" />}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-glass-light text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-glow-purple hover:text-glow-purple/80">
            Sign in
          </Link>
        </p>
      </GlassCard>
    </div>
  );
};
