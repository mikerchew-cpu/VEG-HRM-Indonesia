import type { EmploymentStatus, PtkpStatus } from "@/types/employee";

export const DEPARTMENTS = [
  "Mining",
  "Processing",
  "Maintenance",
  "HSE",
  "Geology",
  "Survey",
  "Logistics",
  "Warehouse",
  "Admin",
  "Finance",
  "HR",
  "IT",
  "Security",
  "Community Development",
] as const;

export const POSITIONS = [
  "Operator Alat Berat",
  "Dump Truck Operator",
  "Excavator Operator",
  "Bulldozer Operator",
  "Loader Operator",
  "Drill Operator",
  "Pengawas Operasional (Supervisor)",
  "Kepala Teknik Tambang",
  "Kepala Lapangan",
  "Surveyor",
  "Geologist",
  "Mine Engineer",
  "Safety Officer",
  "Safety Inspector",
  "HSE Manager",
  "Mekanik Alat Berat",
  "Electrician",
  "Admin Site",
  "HR Staff",
  "Finance Staff",
  "Logistic Staff",
  "Kepala Gudang",
  "Security",
  "Community Development Staff",
] as const;

export const GRADES = [
  "I-A", "I-B", "I-C",
  "II-A", "II-B", "II-C",
  "III-A", "III-B", "III-C",
  "IV-A", "IV-B", "IV-C",
  "V-A", "V-B", "V-C",
] as const;

export const LEVELS = [
  "Pekerja Harian",
  "Pekerja Pelaksana",
  "Staf",
  "Staf Senior",
  "Supervisor",
  "Kepala Seksi",
  "Kepala Bagian",
  "Manager",
  "Senior Manager",
  "General Manager",
  "Direktur",
] as const;

export const EMPLOYMENT_STATUSES: Record<
  EmploymentStatus,
  { label: string; description: string }
> = {
  pkwtt: { label: "Tetap (PKWTT)", description: "Perjanjian Kerja Waktu Tidak Tertentu" },
  pkwt: { label: "Kontrak (PKWT)", description: "Perjanjian Kerja Waktu Tertentu" },
  outsource: { label: "Outsourcing", description: "Alih Daya" },
  harian: { label: "Harian Lepas", description: "Pekerja Harian Lepas" },
};

export const PTKP_STATUSES: PtkpStatus[] = [
  "TK/0", "TK/1", "TK/2", "TK/3",
  "K/0", "K/1", "K/2", "K/3",
  "K/I/0", "K/I/1", "K/I/2", "K/I/3",
];

export const RELIGIONS = [
  "Islam",
  "Kristen Protestan",
  "Kristen Katolik",
  "Hindu",
  "Buddha",
  "Konghucu",
] as const;

export const MARITAL_STATUSES = [
  "Belum Kawin",
  "Kawin",
  "Cerai Hidup",
  "Cerai Mati",
] as const;

export const BLOOD_TYPES = ["A", "B", "AB", "O"] as const;

export const SITES = [
  "Site A - Pit Utama",
  "Site B - Pit Timur",
  "Site C - Pit Barat",
  "Site D - Overburden",
  "Kantor Pusat",
] as const;

export const BANKS = [
  "BCA",
  "Mandiri",
  "BNI",
  "BRI",
  "Bank Syariah Indonesia",
  "Bank Kaltimtara",
  "Bank Kalteng",
  "Bank Kalsel",
] as const;

// Mining-specific certification types
export const CERTIFICATION_TYPES = [
  { key: "sio", label: "SIO (Surat Izin Operasi)", description: "Operator alat berat" },
  { key: "pop", label: "POP (Pengawas Operasional Pertama)", description: "First-level supervisor" },
  { key: "pou", label: "POU (Pengawas Operasional Utama)", description: "Senior supervisor" },
] as const;

// UMP/UMR 2025 database (simplified — top provinces)
export const UMP_2025: Record<string, number> = {
  "Jakarta": 5_396_761,
  "Jawa Barat": 2_184_279,
  "Jawa Timur": 2_304_641,
  "Jawa Tengah": 2_036_947,
  "Kalimantan Timur": 3_518_219,
  "Kalimantan Selatan": 3_424_519,
  "Kalimantan Tengah": 3_294_697,
  "Kalimantan Utara": 3_414_961,
  "Riau": 3_654_459,
  "Kepulauan Riau": 4_204_817,
  "Sumatera Utara": 2_822_481,
  "Sumatera Selatan": 3_684_543,
  "Papua": 4_358_859,
  "Papua Barat": 3_410_135,
  "Sulawesi Tengah": 3_035_248,
  "Sulawesi Selatan": 3_605_216,
  "NTB": 2_595_643,
  "NTT": 2_224_386,
  "Banten": 4_416_788,
  "Aceh": 3_506_631,
};

// UU Cipta Kerja overtime rates
export const OVERTIME_RATES = {
  FIRST_HOUR: 1.5,   // 1.5x hourly wage
  SUBSEQUENT: 2.0,   // 2x hourly wage
  HOLIDAY: 2.0,      // Special for holidays (simplified)
};
