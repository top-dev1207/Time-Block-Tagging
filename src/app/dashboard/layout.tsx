"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-dashboard">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:ml-64 transition-all duration-300">
            <div className="p-6 pt-16 md:pt-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}