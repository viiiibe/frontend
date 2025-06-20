"use client";
import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout()}
      className="rounded-lg bg-gray-500 px-4 py-2 text-white"
    >
      Log Out
    </button>
  );
}; 