import type { Metadata } from 'next';
import { Inter, Space_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navigation } from '@/components/Navigation';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'Gazebio - Premium Bio Link Page Builder',
  description: 'Create stunning, customizable bio link pages for creators and gamers. Advanced themes, animations, and analytics.',
  keywords: ['bio link', 'linktree', 'creator tools', 'portfolio'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable} dark`}>
      <body className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white min-h-screen">
        <AuthProvider>
          <Navigation />
          <main>{children}</main>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: 'rgba(20, 20, 30, 0.9)',
                color: '#f1f5f9',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
