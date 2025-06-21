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
  const { isAuthenticated } = useAuth0();
  if (!isAuthenticated) return null;
  return (
    <nav className="bg-white border-b shadow flex items-center gap-6 px-8 py-3">
      <Link href="/chat" className="font-semibold text-blue-600">Chat</Link>
      <Link href="/problems" className="font-semibold text-blue-600">Problems</Link>
      <Link href="/profile" className="font-semibold text-blue-600">Profile</Link>
      <div className="ml-auto"><LogoutButton /></div>
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
            <NavBar />
            {children}
          </QueryClientProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
