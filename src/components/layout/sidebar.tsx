"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: "◈" },
  { label: "Karyawan", href: "/employees", icon: "👥" },
  { label: "Absensi", href: "/attendance", icon: "⏱" },
  { label: "Penggajian", href: "/payroll", icon: "💰" },
  { label: "Kepatuhan", href: "/compliance", icon: "⚖" },
  { label: "Laporan AI", href: "/reports", icon: "📊" },
  { label: "Pengaturan", href: "/settings", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-tiffany rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">V</span>
          </div>
          <div>
            <span className="text-charcoal font-semibold text-sm block leading-tight">VEG HRM</span>
            <span className="text-gray-400 text-[10px]">Indonesia Mining</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-tiffany-light text-tiffany-dark font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-tiffany-light rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-tiffany-dark">A</span>
          </div>
          <div className="text-xs leading-tight">
            <p className="font-medium text-charcoal">Admin</p>
            <p className="text-gray-400">PT Tambang Indonesia</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
