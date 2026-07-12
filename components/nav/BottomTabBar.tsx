"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleNavItems } from "@/lib/navItems";
import { useAuthStore } from "@/lib/store";

export function BottomTabBar() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.role);
  const items = visibleNavItems(role);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-[#D7DDE9] bg-bg md:hidden">
      {items.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium ${
              isActive
                ? "text-primary-light"
                : "text-gray-700 hover:text-primary-light"
            }`}
          >
            <Icon size={20} />
            {item.label}
            <span
              className={`h-1 w-1 rounded-full ${isActive ? "bg-primary-light" : "bg-transparent"}`}
              aria-hidden="true"
            />
          </Link>
        );
      })}
    </nav>
  );
}
