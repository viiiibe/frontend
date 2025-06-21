"use client";
import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';
import Link from 'next/link';
import { useAuth0 } from '@auth0/auth0-react';

export default function Home() {
  const { isAuthenticated, isLoading, error, user } = useAuth0();
  
  // Debug information
  console.log('Main Page Auth State:', { isAuthenticated, isLoading, error, user });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Welcome to Vibe AI Coding Interview Coach</h1>
      <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
        Get a personalized, AI-powered path to FAANG coding interview success. Practice, get hints, and track your progress—all tailored to you.
      </p>
      
      {/* Debug info */}
      <div className="mb-4 p-4 bg-yellow-100 rounded-lg text-sm">
        <p>Auth State: {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        {error && <p>Error: {error.message}</p>}
        {user && <p>User: {user.name} ({user.email})</p>}
      </div>
      
      <UserProfile />
      {!isAuthenticated && <LoginButton />}
      {isAuthenticated && (
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
