import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Portfolio admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
