"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { UMP_2025 } from "@/lib/constants/compliance";

const COMPLIANCE_ITEMS = [
  { label: "BPJS Kesehatan", status: "compliant", desc: "100% pekerja terdaftar" },
  { label: "BPJS Ketenagakerjaan", status: "compliant", desc: "100% pekerja terdaftar" },
  { label: "PPh 21 (TER)", status: "compliant", desc: "Laporan masa berjalan" },
  { label: "PKWT Batas 5 Tahun", status: "warning", desc: "2 kontrak mendekati batas" },
  { label: "SIO Operator", status: "warning", desc: "5 SIO akan expired" },
  { label: "MCU Berkala", status: "critical", desc: "12 pekerja belum MCU" },
  { label: "SMK3", status: "compliant", desc: "Dokumen lengkap" },
  { label: "K3 Kebakaran", status: "warning", desc: "APAR perlu renewal" },
];

const CERT_EXPIRY = [
  { name: "Budi Santoso", cert: "SIO", number: "SIO-2020-12345", expiry: "31 Des 2025", days: 217, type: "warning" },
  { name: "Ahmad Supriyadi", cert: "SIO", number: "SIO-2021-67890", expiry: "15 Jan 2026", days: 232, type: "warning" },
  { name: "Rudi Hartono", cert: "POP", number: "POP-2022-54321", expiry: "10 Mar 2026", days: 286, type: "warning" },
  { name: "Siti Rahmawati", cert: "POU", number: "POU-2022-98765", expiry: "20 Apr 2026", days: 327, type: "warning" },
  { name: "Herman Susanto", cert: "SIO", number: "SIO-2020-11111", expiry: "5 Jun 2025", days: 8, type: "critical" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "ump" | "cert" | "smk3">("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">Kepatuhan Regulasi</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Compliance terhadap UU Ketenagakerjaan, Pajak, BPJS, dan regulasi mining
        </p>
      </div>

      {/* Overall compliance score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: "Compliance Score", value: "87%", color: "text-tiffany" },
          { label: "Critical Issues", value: "1", color: "text-danger" },
          { label: "Warnings", value: "4", color: "text-warning" },
          { label: "Compliant Items", value: "3", color: "text-tiffany" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "overview" as const, label: "Ringkasan Kepatuhan" },
          { id: "ump" as const, label: "UMP/UMR 2025" },
          { id: "cert" as const, label: "Sertifikasi Mining" },
          { id: "smk3" as const, label: "SMK3 & K3" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === t.id
                ? "bg-tiffany text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COMPLIANCE_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`bg-white border rounded-lg p-4 flex items-start justify-between ${
                item.status === "compliant"
                  ? "border-green-200"
                  : item.status === "warning"
                  ? "border-yellow-200"
                  : "border-red-200"
              }`}
            >
              <div>
                <h3 className="text-sm font-medium text-charcoal">{item.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <span
                className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                  item.status === "compliant"
                    ? "bg-green-50 text-green-700"
                    : item.status === "warning"
                    ? "bg-yellow-50 text-yellow-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {item.status === "compliant" ? "OK" : item.status === "warning" ? "Warning" : "Critical"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* UMP/UMR */}
      {activeTab === "ump" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-1">Upah Minimum Provinsi (UMP) 2025</h2>
          <p className="text-xs text-gray-500 mb-4">Berdasarkan PP 36/2021 — Kenaikan ~6.5% dari 2024</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Provinsi</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">UMP 2025</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">UMK Tambang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(UMP_2025).slice(0, 10).map(([prov, amount]) => (
                <tr key={prov}>
                  <td className="px-3 py-2 text-sm text-charcoal">{prov}</td>
                  <td className="px-3 py-2 text-right text-sm font-medium">{formatRupiah(amount)}</td>
                  <td className="px-3 py-2 text-right text-sm text-gray-400">
                    {formatRupiah(Math.round(amount * 1.15))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Catatan:</strong> UMK untuk sektor pertambangan umumnya 10-20% di atas UMP
              provinsi sesuai Kepmenaker. Perusahaan wajib membayar upah &ge; UMP/UMK.
              Pelanggaran dikenakan sanksi administratif (Pasal 185 UU Cipta Kerja).
            </p>
          </div>
        </Card>
      )}

      {/* Mining Certifications */}
      {activeTab === "cert" && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-1">Sertifikasi Akan Expired</h2>
            <p className="text-xs text-gray-500 mb-4">Permen ESDM 26/2018 — perpanjangan wajib sebelum masa berlaku habis</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Karyawan</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Sertifikat</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">No.</th>
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Expired</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Sisa Hari</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CERT_EXPIRY.map((c) => (
                  <tr key={`${c.name}-${c.cert}`}>
                    <td className="px-3 py-2 text-sm text-charcoal">{c.name}</td>
                    <td className="px-3 py-2 text-sm font-medium">{c.cert}</td>
                    <td className="px-3 py-2 text-xs text-gray-500 font-mono">{c.number}</td>
                    <td className="px-3 py-2 text-sm text-gray-600">{c.expiry}</td>
                    <td className={`px-3 py-2 text-right text-sm font-medium ${
                      c.type === "critical" ? "text-danger" : "text-warning"
                    }`}>
                      {c.days} hari
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Ketentuan Sertifikasi Mining</h2>
            <div className="p-3 bg-tiffany-light rounded-lg space-y-2">
              {[
                { cert: "SIO (Surat Izin Operasi)", req: "Operator alat berat (excavator, bulldozer, dll)", validity: "5 tahun" },
                { cert: "POP (Pengawas Operasional Pertama)", req: "Pengawas lapangan level pertama", validity: "5 tahun" },
                { cert: "POU (Pengawas Operasional Utama)", req: "Pengawas senior/manager tambang", validity: "5 tahun" },
                { cert: "MCU (Medical Check-up)", req: "Semua pekerja tambang", validity: "12 bulan" },
                { cert: "SMK3", req: "Perusahaan wajib memiliki sistem manajemen K3", validity: "3 tahun audit" },
              ].map((s) => (
                <div key={s.cert} className="text-xs text-tiffany-dark">
                  <strong>{s.cert}:</strong> {s.req} (berlaku {s.validity})
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* SMK3 */}
      {activeTab === "smk3" && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">SMK3 (PP 50/2012)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Kebijakan K3", status: "done" },
                { label: "HIRADC", status: "done" },
                { label: "Pelatihan K3", status: "done" },
                { label: "Inspeksi Bulanan", status: "done" },
                { label: "APAR Check", status: "overdue" },
                { label: "Incident Reporting", status: "done" },
                { label: "Emergency Drill", status: "scheduled" },
                { label: "Audit Internal", status: "scheduled" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-charcoal">{s.label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    s.status === "done" ? "bg-green-50 text-green-700" :
                    s.status === "overdue" ? "bg-red-50 text-red-700" :
                    "bg-yellow-50 text-yellow-700"
                  }`}>
                    {s.status === "done" ? "Tersedia" : s.status === "overdue" ? "Overdue" : "Terjadwal"}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Incident History</h2>
            <div className="space-y-2">
              {[
                { date: "15 Mei 2026", type: "Near Miss", site: "Site B", desc: "Longsor tebing pinggir jalan hauling" },
                { date: "2 Apr 2026", type: "First Aid", site: "Site A", desc: "Luka ringan saat ganti bucket" },
                { date: "10 Mar 2026", type: "Property Damage", site: "Site C", desc: "Ban dump truck pecah" },
              ].map((i) => (
                <div key={i.date} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-charcoal">{i.type}</span>
                    <span className="text-xs text-gray-400">{i.date} · {i.site}</span>
                  </div>
                  <p className="text-xs text-gray-600">{i.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-tiffany-light rounded-lg">
              <p className="text-xs text-tiffany-dark">
                <strong>Pelaporan Kecelakaan:</strong> Berdasarkan UU 1/1970 & PP 50/2012,
                kecelakaan kerja wajib dilaporkan ke Disnaker setempat maksimal 2x24 jam.
                Mining incident juga wajib dilaporkan ke Inspektur Tambah (Permen ESDM 26/2018).
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
