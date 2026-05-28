"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "▦" },
  { label: "Employees", href: "/employees", icon: "👥" },
  { label: "Attendance", href: "/attendance", icon: "⏱" },
  { label: "Payroll", href: "/payroll", icon: "💰" },
  { label: "Compliance", href: "/compliance", icon: "⚖" },
  { label: "Reports", href: "/reports", icon: "📊" },
  { label: "Settings", href: "/settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-tiffany font-bold text-lg">VEG</span>
          <span className="text-charcoal font-medium text-sm">HRM</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-tiffany-light text-tiffany-dark font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="text-xs">
            <p className="font-medium text-charcoal">Admin</p>
            <p className="text-gray-500">admin@veg.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
