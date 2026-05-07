'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './Button';
import { Menu, X, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-glass-dark/80 border-b border-glass-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? '/dashboard' : '/'} className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-glow-purple via-glow-pink to-glow-cyan bg-clip-text text-transparent">
              ✨ GAZEBIO
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-glass-light hover:text-white transition">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-glass-light hover:text-white transition">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-glow-purple to-glow-pink flex items-center justify-center text-xs font-bold">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full hidden group-hover:block bg-glass-dark border border-glass-light/20 rounded-lg shadow-glass mt-2 py-2 min-w-max">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-glass-light hover:text-white text-sm"
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-glass-light hover:text-white text-sm"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-glass-light"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-glass-light hover:text-white">
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-glass-light hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
