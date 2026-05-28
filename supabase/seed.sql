-- VEG HRM Indonesia — Initial Schema
-- Run this in Supabase SQL Editor after creating your project

-- 1. Companies (multi-site mining)
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Sites
CREATE TABLE sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  lat numeric,
  lng numeric,
  is_remote boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Employees
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id uuid REFERENCES sites(id),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  nik text,                              -- ID card number (KTP)
  npwp text,                             -- Tax ID
  bpjs_kes text,                         -- BPJS Kesehatan number
  bpjs_tk text,                          -- BPJS Ketenagakerjaan number
  position text NOT NULL,
  department text,
  grade text,
  base_salary numeric NOT NULL,
  daily_rate numeric,
  hire_date date NOT NULL,
  contract_end_date date,
  status text NOT NULL DEFAULT 'active', -- active, terminated, suspended
  phone text,
  emergency_contact jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Attendance records
CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES sites(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  clock_in timestamptz,
  clock_out timestamptz,
  lat_in numeric,
  lng_in numeric,
  lat_out numeric,
  lng_out numeric,
  photo_url text,
  is_offline boolean DEFAULT true,
  status text NOT NULL DEFAULT 'present',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Payroll runs
CREATE TABLE payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period text NOT NULL,                  -- e.g. "2026-05"
  status text NOT NULL DEFAULT 'draft',  -- draft, approved, paid
  total_gross numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  total_net numeric NOT NULL DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 6. Payslips
CREATE TABLE payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_run_id uuid NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  gross_salary numeric NOT NULL,
  overtime_pay numeric DEFAULT 0,
  allowances jsonb DEFAULT '{}',
  deductions jsonb DEFAULT '{}',         -- PPh 21, BPJS, loans
  net_salary numeric NOT NULL,
  bank_transfer_ref text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. AI reports
CREATE TABLE ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  ai_provider text NOT NULL,             -- deepseek, claude, gemini
  period text,
  summary text NOT NULL,
  raw_data jsonb,
  recommendations jsonb,
  tokens_used int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_site ON employees(site_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_ai_reports_type ON ai_reports(report_type);
