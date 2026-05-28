export interface Employee {
  id: string;
  company_id: string;
  site_id: string;
  user_id?: string;
  employee_code: string;

  // Personal
  full_name: string;
  nik: string; // KTP
  place_of_birth: string;
  date_of_birth: string;
  gender: "L" | "P";
  religion: string;
  marital_status: string;
  blood_type: string;
  address: string;
  phone: string;
  email: string;
  photo_url?: string;

  // Tax
  npwp: string;
  ptkp_status: PtkpStatus;
  tax_method: "TER" | "gross" | "net";

  // BPJS
  bpjs_kes_number: string;
  bpjs_tk_number: string;
  bpjs_kes_family_count: number;

  // Employment
  position: string;
  department: string;
  level: string;
  grade: string;
  employment_status: EmploymentStatus;
  hire_date: string;
  contract_end_date?: string;
  resign_date?: string;

  // Compensation
  base_salary: number;
  daily_rate: number;
  overtime_rate: number;
  bank_name: string;
  bank_account: string;
  bank_account_holder: string;

  // Emergency
  emergency_name: string;
  emergency_relation: string;
  emergency_phone: string;

  // Mining certifications
  sio_number?: string;
  sio_expiry?: string;
  pop_number?: string;
  pop_expiry?: string;
  pou_number?: string;
  pou_expiry?: string;
  last_medical_date?: string;
  next_medical_date?: string;

  status: "active" | "terminated" | "suspended";
  created_at: string;
}

export type EmploymentStatus =
  | "pkwtt"      // Tetap
  | "pkwt"       // Kontrak
  | "outsource"  // Alih daya
  | "harian";    // Harian lepas

export type PtkpStatus =
  | "TK/0" | "TK/1" | "TK/2" | "TK/3"
  | "K/0"  | "K/1"  | "K/2"  | "K/3"
  | "K/I/0" | "K/I/1" | "K/I/2" | "K/I/3";

export interface Attendance {
  id: string;
  employee_id: string;
  site_id: string;
  date: string;
  clock_in: string;
  clock_out?: string;
  lat_in?: number;
  lng_in?: number;
  lat_out?: number;
  lng_out?: number;
  photo_url?: string;
  is_offline: boolean;
  status: "present" | "late" | "absent" | "leave" | "sick";
  notes?: string;
}

export interface PayrollRun {
  id: string;
  company_id: string;
  period: string;
  status: "draft" | "approved" | "paid";
  total_gross: number;
  total_deductions: number;
  total_net: number;
  employee_count: number;
  processed_at?: string;
}

export interface Payslip {
  id: string;
  employee_id: string;
  payroll_run_id: string;
  employee_name: string;
  employee_code: string;
  position: string;
  department: string;
  site: string;

  // Earnings
  base_salary: number;
  daily_pay: number;
  overtime_pay: number;
  attendance_allowance: number;
  position_allowance: number;
  transport_allowance: number;
  meal_allowance: number;
  thr_amount: number;
  bonus: number;
  gross_salary: number;

  // Deductions (potongan)
  pph21: number;
  bpjs_kes: number;
  bpjs_tk: number;
  loan_deduction: number;
  absence_deduction: number;
  other_deductions: number;
  total_deductions: number;

  net_salary: number;
  bank_name: string;
  bank_account: string;
  paid_at?: string;
}

export interface Shift {
  id: string;
  site_id: string;
  name: string;
  start_time: string;
  end_time: string;
  pattern: string; // e.g. "4-4", "7-3", "rotating"
}

export interface AiReport {
  id: string;
  company_id: string;
  report_type: string;
  ai_provider: "deepseek" | "claude" | "gemini";
  period: string;
  summary: string;
  recommendations?: string;
  tokens_used: number;
  created_at: string;
}
