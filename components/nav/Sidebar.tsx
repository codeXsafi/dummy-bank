"use client";

import { LogOut, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { visibleNavItems } from "@/lib/navItems";
import { useAuthStore } from "@/lib/store";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const email = useAuthStore((s) => s.email);
  const role = useAuthStore((s) => s.role);
  const logout = useAuthStore((s) => s.logout);
  const items = visibleNavItems(role);

  function handleSignOut() {
    logout();
    router.replace("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col overflow-y-auto md:flex bg-bg border-r border-[#D7DDE9]">
      <div className="relative flex items-center gap-2 text-xl font-semibold font-serif pt-5 pb-5 border-b border-[#D7DDE9] px-5">
        <div className="rounded-full bg-primary-light w-9 h-9 flex items-center justify-center p-1">
          <Wallet size={22} className="text-text-inverse" />
        </div>
        Dummy Bank
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-2 text-sm font-semibold mb-2 transition-colors ${
                isActive
                  ? "text-primary-light bg-[#e9e9e9]"
                  : "text-gray-600 hover:text-primary-light"
              }`}
            >
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary-light"
                  aria-hidden="true"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col start  gap-3 pt-4 pb-4 border-t border-[#D7DDE9]">
        <div className="flex flex-start items-center gap-3 px-4">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-700">
              {email}
            </p>
            <p className="text-xs text-gray-500">{role}</p>
          </div>
        </div>
        <div className="flex flex-start items-center gap-3 px-4">
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sign out"
            className="p-1.5 text-gray-500 flex gap-3 items-center font-semibold hover:text-primary-light cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
