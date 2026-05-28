"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

const PAYROLL_PERIODS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

// TER Table (simplified — monthly effective rates for 2024)
// Source: PER-1/PJ/2024
function getTER(grossMonthly: number, ptkp: string): number {
  const annual = grossMonthly * 12;

  // Simplified TER categories based on PTKP
  const isKawin = ptkp.startsWith("K");
  const tanggungan = parseInt(ptkp.replace("TK/", "").replace("K/", "").replace("K/I/", "")) || 0;
  const ptkpAmount = isKawin
    ? 54_000_000 + (tanggungan + 1) * 4_500_000
    : 54_000_000 + tanggungan * 4_500_000;

  const pkp = Math.max(0, annual - ptkpAmount);

  // Progressive rates
  let tax = 0;
  if (pkp <= 60_000_000) tax = pkp * 0.05;
  else if (pkp <= 250_000_000) tax = 60_000_000 * 0.05 + (pkp - 60_000_000) * 0.15;
  else if (pkp <= 500_000_000) tax = 60_000_000 * 0.05 + 190_000_000 * 0.15 + (pkp - 250_000_000) * 0.25;
  else if (pkp <= 5_000_000_000) tax = 60_000_000 * 0.05 + 190_000_000 * 0.15 + 250_000_000 * 0.25 + (pkp - 500_000_000) * 0.30;
  else tax = pkp * 0.35;

  return tax / 12;
}

function formatRupiah(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

const MOCK_PAYROLL = [
  { name: "Budi Santoso", code: "EMP-001", dept: "Mining", gross: 8_500_000, bpjsKes: 42_500, bpjsTk: 97_750, pph21: 143_750, thr: 8_500_000, net: 8_216_000 },
  { name: "Siti Rahmawati", code: "EMP-002", dept: "HSE", gross: 9_200_000, bpjsKes: 46_000, bpjsTk: 105_800, pph21: 187_500, thr: 9_200_000, net: 8_860_700 },
  { name: "Ahmad Supriyadi", code: "EMP-003", dept: "Mining", gross: 7_800_000, bpjsKes: 39_000, bpjsTk: 89_700, pph21: 97_500, thr: 7_800_000, net: 7_573_800 },
  { name: "Dewi Lestari", code: "EMP-004", dept: "HR", gross: 7_500_000, bpjsKes: 37_500, bpjsTk: 86_250, pph21: 87_500, thr: 7_500_000, net: 7_288_750 },
  { name: "Rudi Hartono", code: "EMP-005", dept: "Maintenance", gross: 8_000_000, bpjsKes: 40_000, bpjsTk: 92_000, pph21: 112_500, thr: 8_000_000, net: 7_755_500 },
];

// BPJS rates (PP 82/2019, PP 49/2023, PMK 64/2020)
const BPJS_RATES = [
  { program: "BPJS Kesehatan", empRate: 1, compRate: 4, maxWage: "12.000.000", desc: "PP 82/2019" },
  { program: "JKK (Kecelakaan Kerja)", empRate: 0, compRate: 0.54, maxWage: "Tidak terbatas", desc: "PP 49/2023 — tergantung tingkat risiko" },
  { program: "JKM (Kematian)", empRate: 0, compRate: 0.3, maxWage: "Tidak terbatas", desc: "PP 49/2023" },
  { program: "JHT (Hari Tua)", empRate: 2, compRate: 3.7, maxWage: "Tidak terbatas", desc: "PP 49/2023" },
  { program: "JP (Pensiun)", empRate: 1, compRate: 2, maxWage: "Tidak terbatas", desc: "PP 49/2023" },
  { program: "JPK (Pensiun JKK/JKM)", empRate: 0, compRate: 0.14, maxWage: "Tidak terbatas", desc: "PP 49/2023" },
];

const PKP_LAYERS = [
  { layer: "0 — Rp 60.000.000", rate: "5%", maxTax: "Rp 3.000.000" },
  { layer: "Rp 60.000.000 — Rp 250.000.000", rate: "15%", maxTax: "Rp 28.500.000" },
  { layer: "Rp 250.000.000 — Rp 500.000.000", rate: "25%", maxTax: "Rp 62.500.000" },
  { layer: "Rp 500.000.000 — Rp 5.000.000.000", rate: "30%", maxTax: "Rp 1.350.000.000" },
  { layer: "> Rp 5.000.000.000", rate: "35%", maxTax: "Tidak terbatas" },
];

export default function PayrollPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Mei");
  const [activeTab, setActiveTab] = useState<"runslip" | "pph21" | "bpjs" | "thr">("runslip");

  const totalGross = MOCK_PAYROLL.reduce((s, e) => s + e.gross, 0);
  const totalNet = MOCK_PAYROLL.reduce((s, e) => s + e.net, 0);
  const totalPph21 = MOCK_PAYROLL.reduce((s, e) => s + e.pph21, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-charcoal">Penggajian</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Payroll, PPh 21 TER, BPJS, THR — patuh regulasi Indonesia
          </p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-tiffany"
        >
          {PAYROLL_PERIODS.map((p) => (
            <option key={p} value={p}>{p} 2026</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Bruto", value: formatRupiah(totalGross), color: "text-charcoal" },
          { label: "Total Potongan PPh 21", value: formatRupiah(totalPph21), color: "text-danger" },
          { label: "Total BPJS (Pekerja)", value: formatRupiah(MOCK_PAYROLL.reduce((s, e) => s + e.bpjsKes + e.bpjsTk, 0)), color: "text-info" },
          { label: "Total Netto", value: formatRupiah(totalNet), color: "text-tiffany" },
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
          { id: "runslip" as const, label: "Run Slip Gaji" },
          { id: "pph21" as const, label: "PPh 21 TER" },
          { id: "bpjs" as const, label: "BPJS" },
          { id: "thr" as const, label: "THR" },
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

      {/* Run Slip */}
      {activeTab === "runslip" && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-600 uppercase">Karyawan</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">Bruto</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">BPJS Kes</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">BPJS TK</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">PPh 21</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-600 uppercase">Netto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_PAYROLL.map((e) => (
                  <tr key={e.code} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{e.name}</p>
                      <p className="text-xs text-gray-400">{e.dept}</p>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatRupiah(e.gross)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(e.bpjsKes)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatRupiah(e.bpjsTk)}</td>
                    <td className="px-4 py-3 text-right text-danger">{formatRupiah(e.pph21)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-tiffany-dark">{formatRupiah(e.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td className="px-4 py-3 text-xs font-semibold text-charcoal">Total</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatRupiah(totalGross)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatRupiah(MOCK_PAYROLL.reduce((s, e) => s + e.bpjsKes, 0))}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatRupiah(MOCK_PAYROLL.reduce((s, e) => s + e.bpjsTk, 0))}</td>
                  <td className="px-4 py-3 text-right font-semibold text-danger">{formatRupiah(totalPph21)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-tiffany-dark">{formatRupiah(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {/* PPh 21 TER */}
      {activeTab === "pph21" && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">PPh 21 TER (Tarif Efektif Rata-rata) 2024</h2>
            <div className="p-3 bg-tiffany-light rounded-lg mb-4">
              <p className="text-xs text-tiffany-dark">
                <strong>Dasar Hukum:</strong> PER-1/PJ/2024 (PMK 168/2023). Mulai Januari 2024,
                perhitungan PPh 21 menggunakan Tarif Efektif Rata-rata (TER) bulanan,
                disetahunkan di Desember.
              </p>
            </div>

            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Lapisan PKP (PPh 21 Pasal 17 UU PPh)</h3>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Lapisan PKP</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Tarif</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {PKP_LAYERS.map((l) => (
                  <tr key={l.layer}>
                    <td className="px-3 py-2 text-sm text-gray-600">{l.layer}</td>
                    <td className="px-3 py-2 text-right text-sm font-medium">{l.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Simulasi Perhitungan</h3>
            {[
              { name: "Budi Santoso", gross: 8_500_000, ptkp: "K/1", ptkpAmount: 63_000_000 },
              { name: "Ahmad Supriyadi", gross: 7_800_000, ptkp: "TK/0", ptkpAmount: 54_000_000 },
            ].map((s) => {
              const annual = s.gross * 12;
              const pkp = Math.max(0, annual - s.ptkpAmount);
              return (
                <div key={s.name} className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="text-xs font-medium text-charcoal mb-1">{s.name} ({s.ptkp})</p>
                  <div className="text-xs text-gray-600 space-y-0.5">
                    <p>Gaji setahun: {formatRupiah(annual)}</p>
                    <p>PTKP ({s.ptkp}): {s.ptkpAmount === 63_000_000 ? "Rp 63.000.000" : "Rp 54.000.000"}</p>
                    <p>PKP: {formatRupiah(pkp)}</p>
                    <p>PPh 21 setahun: {formatRupiah(getTER(s.gross, s.ptkp) * 12)}</p>
                    <p className="font-medium text-tiffany-dark">
                      PPh 21/bulan (TER): {formatRupiah(getTER(s.gross, s.ptkp))}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* BPJS */}
      {activeTab === "bpjs" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-3">Tarif BPJS (PP 82/2019, PP 49/2023)</h2>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Program</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Pekerja</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Perusahaan</th>
                <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Dasar Hukum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {BPJS_RATES.map((b) => (
                <tr key={b.program}>
                  <td className="px-3 py-2 text-sm text-charcoal">{b.program}</td>
                  <td className="px-3 py-2 text-right text-sm">{b.empRate}%</td>
                  <td className="px-3 py-2 text-right text-sm">{b.compRate}%</td>
                  <td className="px-3 py-2 text-right text-xs text-gray-400">{b.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Contoh (gaji Rp 8.500.000):</strong> BPJS Kesehatan = 5% x Rp 8.500.000 = Rp 425.000
              (4% perusahaan = Rp 340.000 + 1% pekerja = Rp 85.000 untuk karyawan lajang).
              Batas maksimal gaji untuk iuran BPJS Kesehatan = Rp 12.000.000 (PMK 64/2020 &
              PMK 65/2020). Untuk BPJS Ketenagakerjaan, total iuran ~8.24% dari upah.
            </p>
          </div>
        </Card>
      )}

      {/* THR */}
      {activeTab === "thr" && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold text-charcoal mb-3">THR (Tunjangan Hari Raya)</h2>
            <div className="p-3 bg-tiffany-light rounded-lg mb-4">
              <p className="text-xs text-tiffany-dark">
                <strong>Dasar Hukum:</strong> PP 36/2021 tentang Pengupahan jo. Permenaker 6/2016.
                THR wajib dibayarkan H-7 hari raya keagamaan. Besaran: 1 bulan gaji bagi pekerja
                dengan masa kerja &ge; 12 bulan, proporsional bagi &lt; 12 bulan.
              </p>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-xs font-medium text-gray-600">Karyawan</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Masa Kerja</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">Gaji</th>
                  <th className="text-right px-3 py-2 text-xs font-medium text-gray-600">THR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_PAYROLL.map((e) => (
                  <tr key={e.code}>
                    <td className="px-3 py-2 text-sm">{e.name}</td>
                    <td className="px-3 py-2 text-right text-sm text-gray-600">6 tahun</td>
                    <td className="px-3 py-2 text-right text-sm">{formatRupiah(e.gross)}</td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-tiffany-dark">{formatRupiah(e.thr)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-xs font-semibold">Total THR</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatRupiah(MOCK_PAYROLL.reduce((s, e) => s + e.thr, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}
