"use client";
import UserProfile from '@/components/auth/UserProfile';

export default function ProfilePage() {
  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <UserProfile />
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-2">Progress & Stats</h2>
        <div className="text-gray-500">Your stats and learning path will appear here.</div>
      </div>
    </main>
  );
} 