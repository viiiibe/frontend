"use client";
import { useUser } from '@auth0/nextjs-auth0/client';

export const UserProfile = () => {
  const { user, isLoading, error } = useUser();

  // Debug information
  console.log('Auth0 State:', { user, isLoading, error });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-4">
      <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
      <div>
        <h2 className="font-semibold">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}; 