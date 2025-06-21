"use client";
import Link from 'next/link';

export const LoginButton = () => {
  return (
    <Link
      href="/api/auth/login"
      className="rounded-lg bg-blue-500 px-4 py-2 text-white inline-block"
    >
      Log In
    </Link>
  );
}; 