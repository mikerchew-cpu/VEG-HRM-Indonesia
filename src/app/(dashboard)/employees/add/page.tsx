"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  DEPARTMENTS, POSITIONS, GRADES, LEVELS, SITES, BANKS,
  RELIGIONS, MARITAL_STATUSES, BLOOD_TYPES, PTKP_STATUSES,
  EMPLOYMENT_STATUSES,
} from "@/lib/constants/compliance";

type FormData = Record<string, string | number>;

const initialForm: FormData = {
  // Personal
  full_name: "", nik: "", place_of_birth: "", date_of_birth: "",
  gender: "L", religion: "Islam", marital_status: "Belum Kawin",
  blood_type: "A", address: "", phone: "", email: "",
  // Tax
  npwp: "", ptkp_status: "TK/0", tax_method: "TER",
  // BPJS
  bpjs_kes_number: "", bpjs_tk_number: "", bpjs_kes_family_count: 0,
  // Employment
  employee_code: "", position: "", department: "Mining",
  level: "Staf", grade: "I-A", employment_status: "pkwt",
  site_id: SITES[0], hire_date: "",
  // Compensation
  base_salary: 0, daily_rate: 0, overtime_rate: 0,
  bank_name: "BCA", bank_account: "", bank_account_holder: "",
  // Emergency
  emergency_name: "", emergency_relation: "", emergency_phone: "",
  // Mining certs
  sio_number: "", sio_expiry: "", pop_number: "", pop_expiry: "",
  pou_number: "", pou_expiry: "", last_medical_date: "", next_medical_date: "",
};

const SECTIONS = [
  { id: "personal", label: "Data Pribadi" },
  { id: "tax", label: "Data Perpajakan" },
  { id: "bpjs", label: "Data BPJS" },
  { id: "employment", label: "Data Kepegawaian" },
  { id: "compensation", label: "Data Kompensasi" },
  { id: "certification", label: "Sertifikasi Mining" },
  { id: "emergency", label: "Kontak Darurat" },
];

export default function AddEmployeePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ ...initialForm });
  const [activeSection, setActiveSection] = useState("personal");

  function setField(key: string, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Save to Supabase
    alert("Karyawan berhasil ditambahkan! (demo — belum terhubung ke database)");
    router.push("/employees");
  }

  function Input({ field, label, type = "text", required }: { field: string; label: string; type?: string; required?: boolean }) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input
          type={type}
          value={form[field] as string}
          onChange={(e) => setField(field, type === "number" ? Number(e.target.value) : e.target.value)}
          required={required}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
        />
      </div>
    );
  }

  function Select({ field, label, options }: { field: string; label: string; options: readonly string[] | string[] }) {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <select
          value={form[field] as string}
          onChange={(e) => setField(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany bg-white"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-charcoal">Tambah Karyawan Baru</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Lengkapi seluruh data sesuai dokumen resmi karyawan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/employees"
            className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-tiffany text-white text-sm font-medium rounded-lg hover:bg-tiffany-dark transition-colors"
          >
            Simpan Karyawan
          </button>
        </div>
      </div>

      {/* Section navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeSection === s.id
                ? "bg-tiffany text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Personal Section */}
      {activeSection === "personal" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data Pribadi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="full_name" label="Nama Lengkap" required />
            <Input field="nik" label="NIK (KTP)" required />
            <Input field="place_of_birth" label="Tempat Lahir" required />
            <Input field="date_of_birth" label="Tanggal Lahir" type="date" required />
            <Select field="gender" label="Jenis Kelamin" options={["L", "P"]} />
            <Select field="religion" label="Agama" options={RELIGIONS as unknown as string[]} />
            <Select field="marital_status" label="Status Perkawinan" options={MARITAL_STATUSES as unknown as string[]} />
            <Select field="blood_type" label="Golongan Darah" options={BLOOD_TYPES as unknown as string[]} />
            <Input field="phone" label="No. Telepon" required />
            <Input field="email" label="Email" type="email" />
            <div className="md:col-span-3">
              <Input field="address" label="Alamat Lengkap" />
            </div>
          </div>
        </Card>
      )}

      {/* Tax Section */}
      {activeSection === "tax" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data Perpajakan (PPh 21)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="npwp" label="NPWP" required />
            <Select field="ptkp_status" label="Status PTKP" options={PTKP_STATUSES as unknown as string[]} />
            <Select field="tax_method" label="Metode Pajak" options={["TER", "gross", "net"]} />
          </div>
          <div className="mt-3 p-3 bg-tiffany-light rounded-lg">
            <p className="text-xs text-tiffany-dark">
              <strong>PTKP 2024:</strong>{ " " }
              {form.ptkp_status === "TK/0" && "Rp 54.000.000/tahun (Tidak Kawin tanpa tanggungan)"}
              {form.ptkp_status === "TK/1" && "Rp 58.500.000/tahun (Tidak Kawin 1 tanggungan)"}
              {form.ptkp_status === "TK/2" && "Rp 63.000.000/tahun (Tidak Kawin 2 tanggungan)"}
              {form.ptkp_status === "TK/3" && "Rp 67.500.000/tahun (Tidak Kawin 3 tanggungan)"}
              {form.ptkp_status === "K/0" && "Rp 58.500.000/tahun (Kawin tanpa tanggungan)"}
              {form.ptkp_status === "K/1" && "Rp 63.000.000/tahun (Kawin 1 tanggungan)"}
              {form.ptkp_status === "K/2" && "Rp 67.500.000/tahun (Kawin 2 tanggungan)"}
              {form.ptkp_status === "K/3" && "Rp 72.000.000/tahun (Kawin 3 tanggungan)"}
              (Peraturan Menteri Keuangan PMK No. 168/2023)
            </p>
          </div>
        </Card>
      )}

      {/* BPJS Section */}
      {activeSection === "bpjs" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data BPJS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="bpjs_kes_number" label="No. BPJS Kesehatan" required />
            <Input field="bpjs_tk_number" label="No. BPJS Ketenagakerjaan" required />
            <Input field="bpjs_kes_family_count" label="Jumlah Keluarga (BPJS Kes)" type="number" />
          </div>
          <div className="mt-3 p-3 bg-tiffany-light rounded-lg">
            <p className="text-xs text-tiffany-dark">
              <strong>Tarif BPJS 2024:</strong> Kesehatan 5% (4% perusahaan + 1% pekerja) dari gaji pokok max Rp 12.000.000.
              Ketenagakerjaan ~8.24% (JKK, JKM, JHT, JP, JPK) sesuai PP 82/2019 jo. PP 49/2023.
            </p>
          </div>
        </Card>
      )}

      {/* Employment Section */}
      {activeSection === "employment" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data Kepegawaian</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="employee_code" label="Kode Karyawan" required />
            <Select field="department" label="Departemen" options={DEPARTMENTS as unknown as string[]} />
            <Select field="position" label="Posisi / Jabatan" options={POSITIONS as unknown as string[]} />
            <Select field="level" label="Level Jabatan" options={LEVELS as unknown as string[]} />
            <Select field="grade" label="Grade / Golongan" options={GRADES as unknown as string[]} />
            <Select field="employment_status" label="Status Kepegawaian" options={Object.entries(EMPLOYMENT_STATUSES).map(([k, v]) => `${k}|${v.label}`)} />
            <Input field="site_id" label="Site / Lokasi Kerja" />
            <Input field="hire_date" label="Tanggal Mulai Kerja" type="date" required />
            <Input field="contract_end_date" label="Akhir Kontrak (PKWT)" type="date" />
          </div>
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>UU Cipta Kerja (UU 6/2023):</strong> PKWT maksimal 5 tahun (termasuk perpanjangan).
              Wajib daftar BPJS Ketenagakerjaan & Kesehatan untuk seluruh pekerja.
            </p>
          </div>
        </Card>
      )}

      {/* Compensation Section */}
      {activeSection === "compensation" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Data Kompensasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="base_salary" label="Gaji Pokok (Rp)" type="number" required />
            <Input field="daily_rate" label="Upah Harian (Rp)" type="number" />
            <Input field="overtime_rate" label="Upah Lembur/Jam (Rp)" type="number" />
            <Select field="bank_name" label="Bank" options={BANKS as unknown as string[]} />
            <Input field="bank_account" label="No. Rekening" required />
            <Input field="bank_account_holder" label="Pemilik Rekening" required />
          </div>
          <div className="mt-3 p-3 bg-tiffany-light rounded-lg">
            <p className="text-xs text-tiffany-dark">
              <strong>UMP/UMR 2025:</strong> Perhitungan upah minimum berdasarkan PP 36/2021.
              Lembur jam pertama 1.5x upah/jam, jam berikutnya 2x upah/jam (UU Cipta Kerja).
            </p>
          </div>
        </Card>
      )}

      {/* Certification Section */}
      {activeSection === "certification" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Sertifikasi Mining</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border border-gray-200 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-charcoal">SIO (Surat Izin Operasi)</h3>
              <Input field="sio_number" label="No. SIO" />
              <Input field="sio_expiry" label="Masa Berlaku" type="date" />
            </div>
            <div className="p-3 border border-gray-200 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-charcoal">POP (Pengawas Operasional Pertama)</h3>
              <Input field="pop_number" label="No. POP" />
              <Input field="pop_expiry" label="Masa Berlaku" type="date" />
            </div>
            <div className="p-3 border border-gray-200 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-charcoal">POU (Pengawas Operasional Utama)</h3>
              <Input field="pou_number" label="No. POU" />
              <Input field="pou_expiry" label="Masa Berlaku" type="date" />
            </div>
            <div className="p-3 border border-gray-200 rounded-lg space-y-3">
              <h3 className="text-xs font-semibold text-charcoal">Medical Check-up</h3>
              <Input field="last_medical_date" label="MCU Terakhir" type="date" />
              <Input field="next_medical_date" label="MCU Berikutnya" type="date" />
            </div>
          </div>
          <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-700">
              <strong>Permen ESDM 26/2018:</strong> Seluruh pekerja tambang wajib memiliki sertifikasi
              sesuai jabatannya. MCU berkala wajib setiap 12 bulan. SIO berlaku 5 tahun.
            </p>
          </div>
        </Card>
      )}

      {/* Emergency Section */}
      {activeSection === "emergency" && (
        <Card>
          <h2 className="text-sm font-semibold text-charcoal mb-4">Kontak Darurat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input field="emergency_name" label="Nama" required />
            <Input field="emergency_relation" label="Hubungan" required />
            <Input field="emergency_phone" label="No. Telepon" required />
          </div>
        </Card>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-2">
        <Link
          href="/employees"
          className="px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          className="px-6 py-2 bg-tiffany text-white text-sm font-medium rounded-lg hover:bg-tiffany-dark transition-colors"
        >
          Simpan Karyawan
        </button>
      </div>
    </form>
  );
}
