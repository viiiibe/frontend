"use client";
import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, isLoading, error } = useUser();
  
  // Debug information
  console.log('Main Page Auth State:', { user, isLoading, error });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to Vibe AI Coding Interview Coach</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
        Get a personalized, AI-powered path to FAANG coding interview success. Practice, get hints, and track your progress—all tailored to you.
      </p>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-yellow-100 rounded-lg text-sm">
        <p>Auth State: {isLoading ? 'Loading...' : user ? 'Authenticated' : 'Not Authenticated'}</p>
        {error && <p>Error: {error.message}</p>}
        {user && <p>User: {user.name} ({user.email})</p>}
      </div>
      
      <UserProfile />
      {!user && !isLoading && <LoginButton />}
      {user && (
        <Link href="/chat" className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
          Go to Dashboard
        </Link>
      )}
      <div className="mt-12 w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Quick Stats</h2>
        <div className="text-gray-500">(Your stats will appear here after login)</div>
      </div>
    </main>
  );
}
