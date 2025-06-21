"use client";
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

export const UserProfile = () => {
  const { user, isAuthenticated, isLoading, error, getAccessTokenSilently } = useAuth0();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('https://backend-bdv7.onrender.com/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch profile');
          }
          setShowPopup(true);
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
          <img 
            src={user.picture} 
            alt={user.name ?? 'User'} 
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
      
      {showPopup && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="glass-card rounded-xl p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">Profile Connected!</p>
                <p className="text-white/70 text-sm">Backend integration successful</p>
              </div>
              <button 
                onClick={() => setShowPopup(false)}
                className="ml-auto text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 