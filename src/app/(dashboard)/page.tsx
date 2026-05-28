"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/providers/language-provider";

export default function DashboardPage() {
  const { t } = useLanguage();

  const stats = [
    { label: "employees.total", value: "1,284", change: "+12", href: "/employees", color: "text-tiffany" },
    { label: "attendance.leave", value: "7", change: "3 remote", href: "/attendance", color: "text-info" },
    { label: "payroll.net", value: "Rp 8.2B", change: "May 2026", href: "/payroll", color: "text-[var(--foreground)]" },
    { label: "compliance.score", value: "87%", change: "2 critical", href: "/compliance", color: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">{t("nav.dashboard")}</h1>
        <p className="text-sm text-[var(--muted-fg)] mt-0.5">
          Overview operasi HR — PT Tambang Indonesia
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:border-tiffany transition-colors cursor-pointer">
              <p className="text-xs text-[var(--muted-fg)] uppercase tracking-wide">{t(s.label as any)}</p>
              <p className={`text-2xl font-semibold ${s.color} mt-1`}>{s.value}</p>
              <p className="text-xs text-[var(--muted-fg)] mt-1">{s.change}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">Aktivitas Terbaru</h3>
          {[
            { text: "Payroll Mei 2026 telah diproses — Rp 8.2B", time: "2 jam lalu" },
            { text: "5 sertifikasi SIO akan expired dalam 30 hari", time: "5 jam lalu" },
            { text: "Site A attendance rate: 94% minggu ini", time: "1 hari lalu" },
            { text: "AI Compliance Report: 4 issues ditemukan", time: "3 hari lalu" },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[var(--card-border)] last:border-0">
              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                ["bg-tiffany", "bg-warning", "bg-info", "bg-purple-400"][i]
              }`} />
              <div className="flex-1">
                <p className="text-sm text-[var(--foreground)]">{a.text}</p>
                <p className="text-xs text-[var(--muted-fg)] mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-[var(--foreground)] mb-3">AI Insight</h3>
          <p className="text-xs text-[var(--muted-fg)]">
            Payroll anomalies: 2 ditemukan. Turnover rate turun 12% QoQ.
            <Link href="/reports" className="text-tiffany font-medium ml-1 hover:underline">{t("nav.reports")}</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
