"use client";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Image from 'next/image';

export const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('http://localhost:1337/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
        } catch {
          // console.error(e);
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-3">
        <div className="spinner w-6 h-6"></div>
        <span className="text-white/70">Loading profile...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center">
        <div className="text-error-400 mb-2">⚠️ Error loading profile</div>
        <div className="text-white/70 text-sm">{error.message}</div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-4">
        {user.picture ? (
          <Image 
            src={user.picture} 
            alt={user.name ?? 'User'} 
            width={64}
            height={64}
            className="w-16 h-16 rounded-full border-4 border-white/20 shadow-lg" 
          />
        ) : (
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center border-4 border-white/20 shadow-lg">
            <span className="text-white text-xl font-bold">
              {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </span>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white">{user.name ?? 'User'}</h2>
        <p className="text-white/70 text-sm">{user.email ?? ''}</p>
      </div>
    </div>
  );
}; 