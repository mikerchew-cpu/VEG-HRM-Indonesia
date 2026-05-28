"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Total Karyawan", value: "1,284", change: "+12 bulan ini", href: "/employees", color: "text-tiffany" },
  { label: "Site Aktif", value: "7", change: "3 remote sites", href: "/attendance", color: "text-info" },
  { label: "Penggajian (Mei)", value: "Rp 8.2B", change: "Netto dibayarkan", href: "/payroll", color: "text-charcoal" },
  { label: "Compliance Score", value: "87%", change: "2 critical items", href: "/compliance", color: "text-warning" },
];

const recentActivity = [
  { type: "payroll", text: "Payroll Mei 2026 telah diproses — Rp 8.2B", time: "2 jam lalu" },
  { type: "compliance", text: "5 sertifikasi SIO akan expired dalam 30 hari", time: "5 jam lalu" },
  { type: "attendance", text: "Site A attendance rate: 94% minggu ini", time: "1 hari lalu" },
  { type: "employee", text: "3 karyawan baru ditambahkan ke Site B", time: "2 hari lalu" },
  { type: "ai", text: "AI Compliance Report: 4 issues ditemukan", time: "3 hari lalu" },
];

const complianceAlerts = [
  { label: "SIO Expired", count: "2 critical", type: "critical" },
  { label: "MCU Berkala Lewat", count: "12 pekerja", type: "critical" },
  { label: "PKWT Mendekati Batas", count: "2 kontrak", type: "warning" },
  { label: "BPJS Reporting", count: "OK", type: "ok" },
  { label: "PPh 21 Masa", count: "Terkini", type: "ok" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-charcoal">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Overview operasi HR — PT Tambang Indonesia
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-tiffany" />
          Sistem terintegrasi dengan Supabase
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="hover:border-tiffany transition-colors cursor-pointer">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-semibold ${s.color} mt-1`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.change}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-medium text-charcoal mb-3">Aktivitas Terbaru</h3>
          <div className="space-y-0">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  a.type === "payroll" ? "bg-tiffany" :
                  a.type === "compliance" ? "bg-warning" :
                  a.type === "attendance" ? "bg-info" :
                  a.type === "ai" ? "bg-purple-400" : "bg-gray-400"
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Compliance Widget */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-charcoal">Compliance Status</h3>
            <Link href="/compliance" className="text-xs text-tiffany hover:underline">Detail</Link>
          </div>
          <div className="space-y-2">
            {complianceAlerts.map((a) => (
              <div key={a.label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-600">{a.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  a.type === "critical" ? "bg-red-50 text-red-700" :
                  a.type === "warning" ? "bg-yellow-50 text-yellow-700" :
                  "bg-green-50 text-green-700"
                }`}>
                  {a.count}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-tiffany-light rounded-lg">
            <h4 className="text-xs font-medium text-tiffany-dark mb-1">AI Insight</h4>
            <p className="text-xs text-tiffany-dark/70">
              Payroll anomalies: 2 ditemukan. Turnover rate turun 12% QoQ.
              <Link href="/reports" className="font-medium underline ml-1">Lihat laporan</Link>
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tambah Karyawan", icon: "+", href: "/employees/add", color: "bg-tiffany" },
          { label: "Proses Payroll", icon: "💰", href: "/payroll", color: "bg-charcoal" },
          { label: "Generate AI Report", icon: "📊", href: "/reports", color: "bg-info" },
          { label: "Cek Compliance", icon: "⚖", href: "/compliance", color: "bg-warning" },
        ].map((a) => (
          <Link
            key={a.label}
            href={a.href}
            className={`${a.color} rounded-lg p-4 text-white hover:opacity-90 transition-opacity`}
          >
            <span className="text-lg">{a.icon}</span>
            <p className="text-sm font-medium mt-1">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
