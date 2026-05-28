-- VEG HRM Indonesia — Complete Schema with Indonesian Compliance
-- Run in Supabase SQL Editor after creating your project

-- 1. Companies
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  address text,
  phone text,
  email text,
  npwp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Sites (multi-location mining sites)
CREATE TABLE sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  lat numeric,
  lng numeric,
  is_remote boolean DEFAULT true,
  shift_pattern text DEFAULT '4-4',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Employees (full Indonesian compliance fields)
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id uuid REFERENCES sites(id),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code text NOT NULL,

  -- Personal
  full_name text NOT NULL,
  nik text NOT NULL,                    -- KTP (16 digit)
  place_of_birth text,
  date_of_birth date,
  gender text NOT NULL DEFAULT 'L',     -- L / P
  religion text,
  marital_status text,                  -- Belum Kawin / Kawin / Cerai Hidup / Cerai Mati
  blood_type text,
  address text,
  phone text,
  email text,
  photo_url text,

  -- Tax (PPh 21)
  npwp text,                            -- 15/16 digit
  ptkp_status text DEFAULT 'TK/0',      -- TK/0, TK/1, TK/2, TK/3, K/0, K/1, K/2, K/3, K/I/0, K/I/1, K/I/2, K/I/3
  tax_method text DEFAULT 'TER',        -- TER / gross / net

  -- BPJS
  bpjs_kes_number text,                 -- BPJS Kesehatan
  bpjs_tk_number text,                  -- BPJS Ketenagakerjaan
  bpjs_kes_family_count int DEFAULT 1,

  -- Employment
  position text NOT NULL,
  department text NOT NULL,
  level text,
  grade text,
  employment_status text NOT NULL DEFAULT 'pkwt', -- pkwtt / pkwt / outsource / harian
  hire_date date NOT NULL,
  contract_end_date date,
  resign_date date,

  -- Compensation
  base_salary numeric NOT NULL DEFAULT 0,
  daily_rate numeric DEFAULT 0,
  overtime_rate numeric DEFAULT 0,
  bank_name text,
  bank_account text,
  bank_account_holder text,

  -- Emergency
  emergency_name text,
  emergency_relation text,
  emergency_phone text,

  -- Mining Certifications (Permen ESDM 26/2018)
  sio_number text,
  sio_expiry date,
  pop_number text,
  pop_expiry date,
  pou_number text,
  pou_expiry date,
  last_medical_date date,
  next_medical_date date,

  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Attendance (offline-first with GPS)
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
  status text NOT NULL DEFAULT 'present', -- present / late / absent / leave / sick
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Shifts
CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id),
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  pattern text NOT NULL DEFAULT '4-4'
);

-- 6. Leave requests
CREATE TABLE leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type text NOT NULL,             -- annual / sick / unpaid / maternity / religious
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending', -- pending / approved / rejected
  approved_by uuid REFERENCES employees(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Overtime records
CREATE TABLE overtimes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  hours numeric NOT NULL,
  rate_multiplier numeric NOT NULL DEFAULT 1.5,
  amount numeric NOT NULL DEFAULT 0,
  approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 8. Payroll runs
CREATE TABLE payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period text NOT NULL,                  -- e.g. "2026-05"
  status text NOT NULL DEFAULT 'draft',  -- draft / approved / paid
  total_gross numeric NOT NULL DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,
  total_net numeric NOT NULL DEFAULT 0,
  employee_count int DEFAULT 0,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 9. Payslips (with full breakdown)
CREATE TABLE payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_run_id uuid NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,

  -- Earnings
  base_salary numeric NOT NULL DEFAULT 0,
  daily_pay numeric DEFAULT 0,
  overtime_pay numeric DEFAULT 0,
  attendance_allowance numeric DEFAULT 0,
  position_allowance numeric DEFAULT 0,
  transport_allowance numeric DEFAULT 0,
  meal_allowance numeric DEFAULT 0,
  thr_amount numeric DEFAULT 0,
  bonus numeric DEFAULT 0,
  gross_salary numeric NOT NULL DEFAULT 0,

  -- Deductions
  pph21 numeric DEFAULT 0,
  bpjs_kes numeric DEFAULT 0,
  bpjs_tk numeric DEFAULT 0,
  loan_deduction numeric DEFAULT 0,
  absence_deduction numeric DEFAULT 0,
  other_deductions numeric DEFAULT 0,
  total_deductions numeric NOT NULL DEFAULT 0,

  net_salary numeric NOT NULL DEFAULT 0,
  bank_name text,
  bank_account text,
  bank_transfer_ref text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 10. THR records
CREATE TABLE thr_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  year int NOT NULL,
  amount numeric NOT NULL,
  months_worked int NOT NULL,
  is_full boolean DEFAULT true,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 11. AI Reports
CREATE TABLE ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  ai_provider text NOT NULL,             -- deepseek / claude / gemini
  period text,
  summary text NOT NULL,
  recommendations jsonb,
  tokens_used int DEFAULT 0,
  model_used text,
  response_time_ms int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 12. Compliance tracking
CREATE TABLE compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category text NOT NULL,                -- bpjs / tax / pph21 / smk3 / cert / contract
  item_name text NOT NULL,
  status text NOT NULL DEFAULT 'compliant', -- compliant / warning / critical
  description text,
  due_date date,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 13. Safety incidents (SMK3)
CREATE TABLE safety_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id uuid REFERENCES sites(id),
  incident_type text NOT NULL,            -- near_miss / first_aid / property_damage / lost_time / fatal
  description text NOT NULL,
  root_cause text,
  action_taken text,
  incident_date date NOT NULL,
  reported_to_disnaker boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 14. Certifications tracking
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  cert_type text NOT NULL,               -- SIO / POP / POU / MCU / SIMB
  cert_number text,
  issued_date date,
  expiry_date date NOT NULL,
  status text NOT NULL DEFAULT 'active',  -- active / expired / renewing
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_site ON employees(site_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_dept ON employees(department);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_site_date ON attendance(site_id, date);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_run ON payslips(payroll_run_id);
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_overtimes_employee ON overtimes(employee_id);
CREATE INDEX idx_ai_reports_company ON ai_reports(company_id);
CREATE INDEX idx_ai_reports_type ON ai_reports(report_type);
CREATE INDEX idx_certifications_employee ON certifications(employee_id);
CREATE INDEX idx_certifications_expiry ON certifications(expiry_date);
CREATE INDEX idx_safety_incidents_date ON safety_incidents(incident_date);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: users can access their own company data
CREATE POLICY "Users can access own company" ON companies
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM employees WHERE company_id = companies.id));

CREATE POLICY "Users can access own site" ON sites
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM employees WHERE site_id = sites.id));

CREATE POLICY "Users can access own employees" ON employees
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM employees WHERE company_id = employees.company_id));

CREATE POLICY "Users can access own attendance" ON attendance
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM employees WHERE id = attendance.employee_id));

-- Seed data: default company
INSERT INTO companies (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'PT Tambang Indonesia', 'pt-tambang-indonesia');

-- Seed data: sites
INSERT INTO sites (id, company_id, name, location, is_remote, shift_pattern) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Site A - Pit Utama', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Site B - Pit Timur', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Site C - Pit Barat', 'Kalimantan Timur', true, '7-3'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Site D - Overburden', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'Kantor Pusat', 'Jakarta', false, '5-2');
