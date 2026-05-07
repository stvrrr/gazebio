'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { GlassCard } from '@/components/Card';
import { Sparkles, Zap, Palette, BarChart3, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Feature = ({ icon: Icon, title, description }: any) => (
  <div className="flex items-start gap-4 p-4">
    <div className="text-3xl text-glow-purple flex-shrink-0">
      <Icon />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-glass-light text-sm">{description}</p>
    </div>
  </div>
);

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-glow-purple/20 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-glow-pink/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>

          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold gradient-text">
              Your Premium Bio Link Page
            </h1>
            <p className="text-xl text-glass-light max-w-2xl mx-auto">
              Create stunning, customizable bio link pages with smooth animations, advanced themes, and powerful analytics. Perfect for creators and gamers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    <Sparkles size={20} className="mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button variant="primary" size="lg">
                      <Sparkles size={20} className="mr-2" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mt-20">
            <GlassCard className="p-8 sm:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    Built for Creators
                  </h2>
                  <p className="text-glass-light mb-8">
                    Everything you need to showcase your content, drive engagement, and connect with your audience. From gamers to artists, build the perfect landing page.
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: Palette, text: '6+ Premium Themes' },
                      { icon: Zap, text: 'Smooth Animations' },
                      { icon: BarChart3, text: 'Analytics & Insights' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white">
                        <item.icon className="text-glow-purple" size={20} />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block">
                  <div className="bg-gradient-to-br from-glow-purple/20 to-glow-pink/20 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="text-glow-purple mx-auto mb-4" size={48} />
                      <p className="text-glass-light">Your Preview Page</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Feature-Rich Platform
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <GlassCard>
              <Feature
                icon={Palette}
                title="Beautiful Themes"
                description="Choose from 6+ handcrafted premium themes including neon gamer, cyberpunk, and soft aesthetic designs."
              />
            </GlassCard>

            <GlassCard>
              <Feature
                icon={Zap}
                title="Smooth Animations"
                description="Professional micro-interactions and smooth transitions that make your page feel premium and polished."
              />
            </GlassCard>

            <GlassCard>
              <Feature
                icon={BarChart3}
                title="Analytics"
                description="Track profile views, link clicks, and engagement metrics to understand your audience better."
              />
            </GlassCard>

            <GlassCard>
              <Feature
                icon={Shield}
                title="Secure & Fast"
                description="Enterprise-grade security with Firebase authentication and optimized for lightning-fast loading."
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Your Premium Page?
            </h2>
            <p className="text-glass-light mb-8 text-lg">
              Join thousands of creators building their perfect bio link pages with Gazebio.
            </p>

            {user ? (
              <Link href="/editor">
                <Button variant="primary" size="lg">
                  <Sparkles size={20} className="mr-2" />
                  Start Creating
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  <Sparkles size={20} className="mr-2" />
                  Get Started for Free
                </Button>
              </Link>
            )}
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
