"use client";
import { useAuth0 } from '@auth0/auth0-react';

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button
      onClick={() => loginWithRedirect()}
      className="rounded-lg bg-blue-500 px-4 py-2 text-white"
    >
      Log In
    </button>
  );
}; 