"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";

const navItemKeys = [
  { label: "nav.dashboard", href: "/", icon: "◈" },
  { label: "nav.employees", href: "/employees", icon: "👥" },
  { label: "nav.attendance", href: "/attendance", icon: "⏱" },
  { label: "nav.payroll", href: "/payroll", icon: "💰" },
  { label: "nav.compliance", href: "/compliance", icon: "⚖" },
  { label: "nav.helpdesk", href: "/helpdesk", icon: "🎧" },
  { label: "nav.reports", href: "/reports", icon: "📊" },
  { label: "nav.settings", href: "/settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t, lang } = useLanguage();

  return (
    <aside className="w-56 bg-[var(--sidebar)] border-r border-[var(--header-border)] flex flex-col h-full shrink-0">
      <div className="px-5 py-5 border-b border-[var(--header-border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-tiffany rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <div>
            <span className="text-[var(--foreground)] font-semibold text-sm block leading-tight">VEG HRM</span>
            <span className="text-[var(--muted-fg)] text-[10px]">Indonesia Mining</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItemKeys.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-tiffany-light text-tiffany-dark font-medium dark:bg-tiffany-dark/20 dark:text-tiffany-light"
                  : "text-[var(--muted-fg)] hover:bg-[var(--muted)]"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {t(item.label as any)}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--header-border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-tiffany-light rounded-full flex items-center justify-center dark:bg-tiffany-dark/30">
            <span className="text-xs font-medium text-tiffany-dark">A</span>
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-[var(--foreground)]">Admin</p>
            <p className="text-[var(--muted-fg)]">PT Tambang Indonesia</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
