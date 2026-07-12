/*
 * app/(dashboard)/settings/page.tsx — profile card + a static "Security"
 * section, plus the account's actual role/email details. The 3 security
 * rows are intentionally non-interactive (no editable settings are wired
 * up, matching this page's original scope) — only Sign Out is a real
 * action, reusing the same logout pattern used in Sidebar.
 */
"use client";

import {
  ChevronRight,
  KeyRound,
  Laptop,
  LogOut,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/lib/store";
import { usePageTitle } from "@/lib/usePageTitle";

const SECURITY_ITEMS = [
  { icon: KeyRound, label: "Change password" },
  { icon: Smartphone, label: "Two-factor authentication" },
  { icon: Laptop, label: "Manage trusted devices" },
];

export default function SettingsPage() {
  usePageTitle("Settings");
  const router = useRouter();
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);

  function handleSignOut() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="max-w-md">
        <div className="flex items-center gap-3">
          <Avatar
            email={email}
            size="md"
            className="bg-accent/20 rounded-xl text-primary-foreground"
          />
          <div>
            <p className="font-medium text-text">{email}</p>
            <p className="text-xs capitalize text-text-muted">
              {role} · Member since Jan 2024
            </p>
          </div>
        </div>
      </Card>

      <div className="max-w-md overflow-hidden rounded-2xl border border-border bg-bg">
        <p className="border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Security
        </p>
        {SECURITY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 border-b border-border px-4 py-3 text-sm last:border-b-0"
            >
              <Icon size={16} className="text-text-muted" />
              <span className="flex-1 text-text">{item.label}</span>
              <ChevronRight size={16} className="text-text-muted" />
            </div>
          );
        })}
      </div>

      {/* max-w-md matches the cards above — without it, this flex column's
          default align-items:stretch would let the button fill the full
          content width instead of sitting the same size as the rest of
          the page's controls. */}
      <Button variant="danger" onClick={handleSignOut} className="max-w-md">
        <LogOut size={16} />
        Sign out
      </Button>
    </div>
  );
}
