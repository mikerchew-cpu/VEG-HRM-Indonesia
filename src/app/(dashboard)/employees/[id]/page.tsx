"use client";

import Link from "next/link";

const MOCK = {
  id: "1",
  employee_code: "EMP-001",
  full_name: "Budi Santoso",
  nik: "3273010101900001",
  place_of_birth: "Jakarta",
  date_of_birth: "1990-01-01",
  gender: "L" as const,
  religion: "Islam",
  marital_status: "Kawin",
  blood_type: "O",
  address: "Jl. Merdeka No. 123, Jakarta Pusat",
  phone: "0812-3456-7890",
  email: "budi@perusahaan.com",
  npwp: "99.000.000.0-000.000",
  ptkp_status: "K/1" as const,
  tax_method: "TER",
  bpjs_kes_number: "0001234567890",
  bpjs_tk_number: "0001234567891",
  bpjs_kes_family_count: 3,
  position: "Excavator Operator",
  department: "Mining",
  level: "Pekerja Pelaksana",
  grade: "III-A",
  employment_status: "pkwtt" as const,
  site_id: "Site A - Pit Utama",
  hire_date: "2020-03-15",
  base_salary: 8_500_000,
  daily_rate: 283_333,
  overtime_rate: 35_416,
  bank_name: "BCA",
  bank_account: "1234567890",
  bank_account_holder: "Budi Santoso",
  emergency_name: "Sari Dewi",
  emergency_relation: "Istri",
  emergency_phone: "0812-9876-5432",
  sio_number: "SIO-2020-12345",
  sio_expiry: "2025-12-31",
  pop_number: "POP-2021-67890",
  pop_expiry: "2026-06-30",
  pou_number: "-",
  pou_expiry: "-",
  last_medical_date: "2025-01-15",
  next_medical_date: "2026-01-15",
  status: "active" as const,
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-gray-100 py-2">
      <span className="w-1/3 text-xs text-gray-500">{label}</span>
      <span className="w-2/3 text-sm text-charcoal">{value}</span>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const emp = MOCK;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-charcoal">{emp.full_name}</h1>
            <p className="text-sm text-gray-500">{emp.position} · {emp.employee_code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">
            Edit
          </button>
          <button className="px-3 py-1.5 bg-tiffany text-white text-sm rounded-lg hover:bg-tiffany-dark">
            Cetak
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar & Status */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
          <div className="w-20 h-20 bg-tiffany-light rounded-full flex items-center justify-center mx-auto">
            <span className="text-xl font-semibold text-tiffany-dark">
              {emp.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <h2 className="mt-3 font-semibold text-charcoal">{emp.full_name}</h2>
          <p className="text-xs text-gray-500">{emp.position}</p>
          <div className="mt-4 space-y-2">
            <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
              Aktif
            </span>
            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium ml-1">
              {emp.employment_status === "pkwtt" ? "Tetap (PKWTT)" : emp.employment_status === "pkwt" ? "Kontrak (PKWT)" : emp.employment_status}
            </span>
          </div>
        </div>

        {/* Right — Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Personal */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Data Pribadi</h3>
            <Row label="NIK (KTP)" value={emp.nik} />
            <Row label="Tempat/Tgl Lahir" value={`${emp.place_of_birth}, ${new Date(emp.date_of_birth).toLocaleDateString("id-ID")}`} />
            <Row label="Jenis Kelamin" value={emp.gender === "L" ? "Laki-laki" : "Perempuan"} />
            <Row label="Agama" value={emp.religion} />
            <Row label="Status" value={emp.marital_status} />
            <Row label="Alamat" value={emp.address} />
            <Row label="Telepon" value={emp.phone} />
            <Row label="Email" value={emp.email} />
          </div>

          {/* Tax & BPJS */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Pajak & BPJS</h3>
            <Row label="NPWP" value={emp.npwp} />
            <Row label="PTKP" value={`${emp.ptkp_status} — ${emp.ptkp_status === "K/1" ? "Kawin 1 tanggungan" : ""}`} />
            <Row label="Metode Pajak" value={emp.tax_method} />
            <Row label="BPJS Kesehatan" value={emp.bpjs_kes_number} />
            <Row label="BPJS Ketenagakerjaan" value={emp.bpjs_tk_number} />
          </div>

          {/* Employment */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Kepegawaian</h3>
            <Row label="Departemen" value={emp.department} />
            <Row label="Level / Grade" value={`${emp.level} / ${emp.grade}`} />
            <Row label="Status" value={emp.employment_status === "pkwtt" ? "Tetap (PKWTT)" : "Kontrak (PKWT)"} />
            <Row label="Site" value={emp.site_id} />
            <Row label="Mulai Kerja" value={new Date(emp.hire_date).toLocaleDateString("id-ID")} />
            <Row label="Gaji Pokok" value={`Rp ${emp.base_salary.toLocaleString("id-ID")}`} />
            <Row label="Upah Harian" value={`Rp ${emp.daily_rate.toLocaleString("id-ID")}`} />
            <Row label="Bank" value={`${emp.bank_name} — ${emp.bank_account}`} />
          </div>

          {/* Certifications */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Sertifikasi Mining (Permen ESDM 26/2018)
            </h3>
            <Row label="SIO" value={`${emp.sio_number} (exp: ${emp.sio_expiry})`} />
            <Row label="POP" value={`${emp.pop_number} (exp: ${emp.pop_expiry})`} />
            <Row label="POU" value={`${emp.pou_number} (exp: ${emp.pou_expiry})`} />
            <Row label="MCU Terakhir" value={new Date(emp.last_medical_date).toLocaleDateString("id-ID")} />
            <Row label="MCU Berikutnya" value={new Date(emp.next_medical_date).toLocaleDateString("id-ID")} />
          </div>
        </div>
      </div>
    </div>
  );
}
