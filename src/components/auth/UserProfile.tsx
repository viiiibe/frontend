"use client";
import { useAuth0 } from '@auth0/auth0-react';

export const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth0();

  // Debug information
  console.log('Auth0 State:', { isAuthenticated, isLoading, error, user });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
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