'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Edit2, Eye, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export const QuickActions: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [copying, setCopying] = useState(false);

  const copyLink = async () => {
    if (!user) return;

    setCopying(true);
    try {
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`;
      await navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Link href="/editor" className="w-full">
        <Button variant="primary" size="lg" className="w-full">
          <Edit2 size={20} className="mr-2" />
          Edit Page
        </Button>
      </Link>

      <Link href={`/${user?.username}`} target="_blank" className="w-full">
        <Button variant="secondary" size="lg" className="w-full">
          <Eye size={20} className="mr-2" />
          View Live
        </Button>
      </Link>

      <Button
        variant="glow"
        size="lg"
        className="w-full"
        onClick={copyLink}
        isLoading={copying}
      >
        <Copy size={20} className="mr-2" />
        Copy Link
      </Button>
    </div>
  );
};
