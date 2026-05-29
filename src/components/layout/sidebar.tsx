"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import { useMobileMenu } from "@/providers/mobile-menu-provider";

const navItemKeys = [
  { label: "nav.dashboard", href: "/", icon: "◈" },
  { label: "nav.employees", href: "/employees", icon: "👥" },
  { label: "nav.attendance", href: "/attendance", icon: "⏱" },
  { label: "nav.payroll", href: "/payroll", icon: "💰" },
  { label: "nav.compliance", href: "/compliance", icon: "⚖" },
  { label: "nav.helpdesk", href: "/helpdesk", icon: "🎧" },
  { label: "nav.reports", href: "/reports", icon: "📊" },
  { label: "nav.ai_providers", href: "/ai-providers", icon: "🤖" },
  { label: "nav.settings", href: "/settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { open, setOpen } = useMobileMenu();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-[var(--sidebar)] border-r border-[var(--header-border)] flex flex-col h-full shrink-0
          fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="px-5 py-5 border-b border-[var(--header-border)] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-tiffany rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <div>
              <span className="text-[var(--foreground)] font-semibold text-sm block leading-tight">VEG HRM</span>
              <span className="text-[var(--muted-fg)] text-[10px]">Indonesia Mining</span>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-[var(--muted-fg)] hover:text-[var(--foreground)] p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItemKeys.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
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
            <div className="w-8 h-8 bg-tiffany-light rounded-full flex items-center justify-center dark:bg-tiffany-dark/30 shrink-0">
              <span className="text-xs font-medium text-tiffany-dark">A</span>
            </div>
            <div className="text-xs leading-tight min-w-0">
              <p className="font-medium text-[var(--foreground)] truncate">Admin</p>
              <p className="text-[var(--muted-fg)] truncate">PT Tambang Indonesia</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
