"use client";
import Link from 'next/link';

export const LogoutButton = () => {
  return (
    <Link
      href="/api/auth/logout"
      className="rounded-lg bg-red-500 px-4 py-2 text-white text-sm"
    >
      Log Out
    </Link>
  );
}; 