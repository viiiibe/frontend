"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LogoutButton } from '../components/auth/LogoutButton';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

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
  const { user, isLoading } = useUser();
  if (isLoading || !user) return null;
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
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <NavBar />
            {children}
          </QueryClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
