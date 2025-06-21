"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from '@auth0/auth0-react';
import { auth0Config } from '../lib/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogoutButton } from '../components/auth/LogoutButton';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

function NavBar() {
  const { isAuthenticated, user } = useAuth0();
  if (!isAuthenticated) return null;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/chat" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text">Vibe AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/chat" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <span className="text-white/90 group-hover:text-white transition-colors">Chat</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/problems" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <span className="text-white/90 group-hover:text-white transition-colors">Problems</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/profile" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              <span className="text-white/90 group-hover:text-white transition-colors">Profile</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-white/90 text-sm font-medium">{user.name || user.email}</span>
              </div>
            )}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Auth0Provider {...auth0Config}>
          <QueryClientProvider client={queryClient}>
            {/* Background elements with negative z-index */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 gradient-bg opacity-90"></div>
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            
            {/* Content with its own stacking context */}
            <div className="relative">
              <NavBar />
              <div className="pt-20">
                {children}
              </div>
            </div>
          </QueryClientProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
