/*
 * app/(dashboard)/layout.tsx — shared layout for every authenticated route(anything nested inside his route group). This is where session protection lives.
 */
"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { Header } from "@/components/nav/Header";
import { Sidebar } from "@/components/nav/Sidebar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { viewerBlockedFromTransactions } from "@/lib/rbac";
import { useAuthStore } from "@/lib/store";
import { useIdleTimer } from "@/lib/useIdleTimer";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const [showIdleWarning, setShowIdleWarning] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
    }
  }, [token, router]);

  useEffect(() => {
    if (viewerBlockedFromTransactions(role, pathname)) {
      router.replace("/dashboard");
    }
  }, [role, pathname, router]);

  const handleIdleWarning = useCallback(() => setShowIdleWarning(true), []);

  const handleIdleTimeout = useCallback(() => {
    setShowIdleWarning(false);
    logout();
    router.replace("/login");
  }, [logout, router]);

  const { resetTimers } = useIdleTimer({
    onWarning: handleIdleWarning,
    onTimeout: handleIdleTimeout,
  });

  function handleStillHere() {
    setShowIdleWarning(false);
    resetTimers();
  }

  // Render nothing while the redirect effect above is in flight, so an
  // unauthenticated visitor never sees a flash of protected content before
  // being sent to /login.
  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-[#F6F8FC]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 pb-20 md:pb-4">{children}</main>
      </div>
      <BottomTabBar />

      <Modal
        isOpen={showIdleWarning}
        onClose={handleStillHere}
        title="Are you still there?"
      >
        <p className="text-sm text-text-muted">
          You&apos;ve been inactive for a while. For your security, you&apos;ll
          be signed out automatically if there&apos;s no activity soon.
        </p>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleStillHere}>Continue session</Button>
        </div>
      </Modal>
    </div>
  );
}
