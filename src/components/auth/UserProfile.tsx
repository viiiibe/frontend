"use client";
import { useAuth0 } from '@auth0/auth0-react';

export const UserProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div className="flex items-center space-x-4">
      <img src={user?.picture} alt={user?.name} className="w-10 h-10 rounded-full" />
      <div>
        <h2 className="font-semibold">{user?.name}</h2>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
}; 