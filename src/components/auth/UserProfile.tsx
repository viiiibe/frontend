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
          const response = await fetch('https://backend-bdv7.onrender.com/users/me', {
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
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-4">
      {user.picture && (
        <img src={user.picture} alt={user.name ?? 'User'} className="w-10 h-10 rounded-full" />
      )}
      <div>
        <h2 className="font-semibold">{user.name ?? 'User'}</h2>
        <p className="text-sm text-gray-500">{user.email ?? ''}</p>
      </div>
      {showPopup && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: 'white', border: '1px solid #ccc', padding: 20, zIndex: 1000 }}>
          <p>Backend profile request successful!</p>
          <button onClick={() => setShowPopup(false)} style={{ marginTop: 10 }}>Close</button>
        </div>
      )}
    </div>
  );
}; 