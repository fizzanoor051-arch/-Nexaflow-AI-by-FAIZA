import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Sidebar />

      <div className="lg:pl-72">
        <Topbar
          title="Dashboard"
          description="Monitor your AI-powered business automation."
        />

        <main className="min-h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}