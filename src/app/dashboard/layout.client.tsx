"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardNavbar from "@/components/dashboard-navbar";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Set up navigation state tracking
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true);
    };

    const handleComplete = () => {
      setIsNavigating(false);
    };

    // Add event listeners for navigation
    window.addEventListener("beforeunload", handleStart);
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin)
      ) {
        handleStart();
      }
    });

    // Clean up
    return () => {
      window.removeEventListener("beforeunload", handleStart);
    };
  }, []);

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-auto relative">
          {isNavigating && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground">Carregando...</p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
