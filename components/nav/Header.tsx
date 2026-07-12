"use client";

import { Bell, Wallet } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useAuthStore } from "@/lib/store";

export function Header() {
  const email = useAuthStore((s) => s.email);

  return (
    <header className="flex items-center justify-between px-4 py-3  border-b border-[#D7DDE9]">
      <div className="relative flex items-center gap-2 text-xl font-semibold font-serif pt-5 pb-5 px-5 md:hidden">
        <div className="rounded-full bg-primary-light w-9 h-9 flex items-center justify-center p-1">
          <Wallet size={22} className="text-text-inverse" />
        </div>
        Dummy Bank
      </div>
      <div className="items-center gap-3 hidden md:block font-semibold text-lg text-text">
        Dashboard
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ThemeSwitcher />
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-full p-2 cursor-pointer text-primary border border-border hover:bg-primary-light hover:text-text-inverse"
        >
          <Bell size={18} />
        </button>
        <Link href="/settings" aria-label="Account settings">
          <Avatar email={email} />
        </Link>
      </div>
    </header>
  );
}
