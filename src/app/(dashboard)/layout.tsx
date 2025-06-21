export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // The 'pt-20' on the main layout container is 5rem (80px).
  // We subtract this from the full viewport height to prevent the page from overflowing.
  return (
    <div className="h-[calc(100vh-5rem)]">{children}</div>
  );
} 