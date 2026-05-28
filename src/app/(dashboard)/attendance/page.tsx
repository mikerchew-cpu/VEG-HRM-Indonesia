"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { OVERTIME_RATES, SITES } from "@/lib/constants/compliance";

const SHIFT_PATTERNS = [
  { id: "4-4", label: "4-4 (4 hari kerja, 4 hari libur)", desc: "Pola rotasi 4/4 untuk area tambang" },
  { id: "7-3", label: "7-3 (7 hari kerja, 3 hari libur)", desc: "Pola rotasi 7/3" },
  { id: "5-2", label: "5-2 (Senin-Jumat)", desc: "Pola kerja kantor pusat" },
  { id: "6-1", label: "6-1 (Senin-Sabtu)", desc: "Pola 6 hari kerja" },
  { id: "24/7", label: "24/7 (3 shift rotasi)", desc: "Pembagian shift pagi/siang/malam" },
];

const SHIFT_TIMES = [
  { label: "Pagi", start: "06:00", end: "14:00" },
  { label: "Siang", start: "14:00", end: "22:00" },
  { label: "Malam", start: "22:00", end: "06:00" },
];

const RECENT_ATTENDANCE = [
  { name: "Budi Santoso", site: "Site A", status: "Hadir", time: "06:12", type: "Pagi" },
  { name: "Ahmad Supriyadi", site: "Site A", status: "Hadir", time: "06:05", type: "Pagi" },
  { name: "Rudi Hartono", site: "Site C", status: "Terlambat", time: "07:45", type: "Pagi", late: true },
  { name: "Siti Rahmawati", site: "Site B", status: "Izin", time: "-", type: "-" },
  { name: "Dewi Lestari", site: "Kantor Pusat", status: "Hadir", time: "07:55", type: "Kantor" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function AttendancePage() {
  const [selectedPattern, setSelectedPattern] = useState("4-4");
  const [selectedSite, setSelectedSite] = useState("");
  const pattern = SHIFT_PATTERNS.find((p) => p.id === selectedPattern);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">Absensi & Kehadiran</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola shift, rotasi, lembur, dan kehadiran pekerja tambang
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Hadir Hari Ini", value: "42", color: "text-tiffany" },
          { label: "Terlambat", value: "3", color: "text-warning" },
          { label: "Izin / Sakit", value: "5", color: "text-info" },
          { label: "Tidak Hadir", value: "2", color: "text-danger" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shift Pattern Management */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Pola Shift & Rotasi</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {SHIFT_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPattern(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPattern === p.id
                      ? "bg-tiffany text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {pattern && (
              <div className="p-3 bg-tiffany-light rounded-lg mb-4">
                <p className="text-sm font-medium text-tiffany-dark">{pattern.label}</p>
                <p className="text-xs text-tiffany-dark/70 mt-0.5">{pattern.desc}</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {SHIFT_TIMES.map((s) => (
                <div key={s.label} className="p-3 border border-gray-200 rounded-lg text-center">
                  <p className="text-xs font-medium text-gray-600">{s.label}</p>
                  <p className="text-sm text-charcoal font-mono mt-0.5">
                    {s.start} - {s.end}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Overtime Calculator */}
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Perhitungan Lembur (UU Cipta Kerja)</h2>
            <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
              <p className="text-gray-600">
                <strong className="text-charcoal">Jam pertama:</strong>{" "}
                {OVERTIME_RATES.FIRST_HOUR}x upah sejam
              </p>
              <p className="text-gray-600">
                <strong className="text-charcoal">Jam berikutnya:</strong>{" "}
                {OVERTIME_RATES.SUBSEQUENT}x upah sejam
              </p>
              <p className="text-gray-600">
                <strong className="text-charcoal">Maksimum lembur:</strong>{" "}
                4 jam/hari atau 18 jam/minggu (Pasal 26 PP 35/2021)
              </p>
              <p className="text-gray-600">
                <strong className="text-charcoal">Contoh (gaji Rp 8.500.000/bulan):</strong>{" "}
                Upah/jam = 1/173 x Rp 8.500.000 = {formatRupiah(Math.round(8500000 / 173))}
              </p>
              <div className="mt-2 p-2 bg-white rounded border border-gray-200 text-xs text-gray-500">
                Lembur 3 jam: ({OVERTIME_RATES.FIRST_HOUR}x + 2 x {OVERTIME_RATES.SUBSEQUENT}x) x {formatRupiah(Math.round(8500000 / 173))}{" "}
                = {formatRupiah(Math.round((OVERTIME_RATES.FIRST_HOUR + 2 * OVERTIME_RATES.SUBSEQUENT) * (8500000 / 173)))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right — Recent & Offline */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Kehadiran Hari Ini</h2>
            <div className="space-y-2">
              {RECENT_ATTENDANCE.map((a) => (
                <div key={a.name} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-charcoal">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.site} · {a.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-medium ${a.late ? "text-warning" : a.status === "Hadir" ? "text-tiffany" : "text-gray-400"}`}>
                      {a.status}
                    </p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Absensi Offline</h2>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-700">
                <strong>Offline mode:</strong> Di area tambang terpencil, absensi tetap
                terekam via GPS + face recognition. Data akan sinkron otomatis saat
                koneksi tersedia.
              </p>
            </div>
            <div className="mt-3 space-y-2 text-xs text-gray-500">
              <p>✅ 38 data tersinkron</p>
              <p>⏳ 4 data menunggu sinkron</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">Cuti & Izin</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Cuti Tahunan</span>
                <span className="font-medium text-charcoal">12 hari (max)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cuti Sakit</span>
                <span className="font-medium text-charcoal">3 pemakaian</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Izin</span>
                <span className="font-medium text-charcoal">2 pemakaian</span>
              </div>
            </div>
            <div className="mt-3 p-3 bg-tiffany-light rounded-lg">
              <p className="text-xs text-tiffany-dark">
                <strong>UU Cipta Kerja:</strong> Cuti tahunan minimal 12 hari setelah 1 tahun kerja.
                Cuti sakit wajib disertai surat dokter. Izin dapat diberikan untuk kepentingan mendesak.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
