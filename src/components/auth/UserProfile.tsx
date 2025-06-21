"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

export const UserProfile = () => {
  const { user, isLoading, error } = useUser();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('https://backend-bdv7.onrender.com/users/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(() => {
          setShowPopup(true);
        })
        .catch(() => {
          // Optionally handle error
        });
    }
  }, [user]);

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
      {user.picture && (
        <img src={user.picture ?? ''} alt={user.name ?? 'User'} className="w-10 h-10 rounded-full" />
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