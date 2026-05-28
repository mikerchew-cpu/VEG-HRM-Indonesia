-- VEG HRM Indonesia — Optimized Schema with Indonesian Compliance
-- Run: psql "postgresql://..." -f supabase/seed.sql

-- ============================================================
-- 1. ENUMS (constrain values, save space vs text)
-- ============================================================
CREATE TYPE employment_status AS ENUM ('pkwtt', 'pkwt', 'outsource', 'harian');
CREATE TYPE ptkp_status AS ENUM ('TK/0','TK/1','TK/2','TK/3','K/0','K/1','K/2','K/3','K/I/0','K/I/1','K/I/2','K/I/3');
CREATE TYPE tax_method AS ENUM ('TER','gross','net');
CREATE TYPE gender AS ENUM ('L','P');
CREATE TYPE employee_status AS ENUM ('active','terminated','suspended');
CREATE TYPE attendance_status AS ENUM ('present','late','absent','leave','sick');
CREATE TYPE leave_type AS ENUM ('annual','sick','unpaid','maternity','religious');
CREATE TYPE leave_status AS ENUM ('pending','approved','rejected');
CREATE TYPE payroll_status AS ENUM ('draft','approved','paid');
CREATE TYPE incident_type AS ENUM ('near_miss','first_aid','property_damage','lost_time','fatal');
CREATE TYPE cert_type AS ENUM ('SIO','POP','POU','MCU','SIMB');
CREATE TYPE cert_status AS ENUM ('active','expired','renewing');
CREATE TYPE compliance_status AS ENUM ('compliant','warning','critical');
CREATE TYPE ai_provider AS ENUM ('deepseek','claude','gemini','custom');
CREATE TYPE shift_pattern AS ENUM ('4-4','7-3','5-2','6-1','24/7');

-- ============================================================
-- 2. TABLES (with proper types, constraints, and defaults)
-- ============================================================

CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  logo_url text,
  address text,
  phone text,
  email text,
  npwp text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  lat numeric CHECK (lat IS NULL OR (lat >= -90 AND lat <= 90)),
  lng numeric CHECK (lng IS NULL OR (lng >= -180 AND lng <= 180)),
  is_remote boolean NOT NULL DEFAULT true,
  shift_pattern shift_pattern NOT NULL DEFAULT '4-4',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id uuid REFERENCES sites(id),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code text NOT NULL,
  full_name text NOT NULL,
  nik text NOT NULL,
  place_of_birth text,
  date_of_birth date,
  gender gender NOT NULL DEFAULT 'L',
  religion text,
  marital_status text,
  blood_type text,
  address text,
  phone text,
  email text,
  photo_url text,
  npwp text,
  ptkp_status ptkp_status NOT NULL DEFAULT 'TK/0',
  tax_method tax_method NOT NULL DEFAULT 'TER',
  bpjs_kes_number text,
  bpjs_tk_number text,
  bpjs_kes_family_count int NOT NULL DEFAULT 1 CHECK (bpjs_kes_family_count >= 1),
  position text NOT NULL,
  department text NOT NULL,
  level text,
  grade text,
  employment_status employment_status NOT NULL DEFAULT 'pkwt',
  hire_date date NOT NULL,
  contract_end_date date,
  resign_date date,
  base_salary numeric NOT NULL DEFAULT 0 CHECK (base_salary >= 0),
  daily_rate numeric DEFAULT 0 CHECK (daily_rate >= 0),
  overtime_rate numeric DEFAULT 0 CHECK (overtime_rate >= 0),
  bank_name text,
  bank_account text,
  bank_account_holder text,
  emergency_name text,
  emergency_relation text,
  emergency_phone text,
  sio_number text,
  sio_expiry date,
  pop_number text,
  pop_expiry date,
  pou_number text,
  pou_expiry date,
  last_medical_date date,
  next_medical_date date,
  status employee_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_dates CHECK (
    (contract_end_date IS NULL OR contract_end_date > hire_date) AND
    (resign_date IS NULL OR resign_date >= hire_date) AND
    (sio_expiry IS NULL OR pop_expiry IS NULL OR pou_expiry IS NULL OR
     next_medical_date IS NULL OR last_medical_date IS NULL OR
     next_medical_date > last_medical_date)
  ),
  CONSTRAINT valid_nik CHECK (nik ~ '^\d{16}$')
);

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  site_id uuid NOT NULL REFERENCES sites(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  clock_in timestamptz,
  clock_out timestamptz,
  lat_in numeric CHECK (lat_in IS NULL OR (lat_in >= -90 AND lat_in <= 90)),
  lng_in numeric CHECK (lng_in IS NULL OR (lng_in >= -180 AND lng_in <= 180)),
  lat_out numeric CHECK (lat_out IS NULL OR (lat_out >= -90 AND lat_out <= 90)),
  lng_out numeric CHECK (lng_out IS NULL OR (lng_out >= -180 AND lng_out <= 180)),
  photo_url text,
  is_offline boolean NOT NULL DEFAULT true,
  status attendance_status NOT NULL DEFAULT 'present',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, date)
);

CREATE TABLE shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  pattern shift_pattern NOT NULL DEFAULT '4-4'
);

CREATE TABLE leave_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type leave_type NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  status leave_status NOT NULL DEFAULT 'pending',
  approved_by uuid REFERENCES employees(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_leave_dates CHECK (end_date >= start_date)
);

CREATE TABLE overtimes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  hours numeric NOT NULL CHECK (hours > 0 AND hours <= 24),
  rate_multiplier numeric NOT NULL DEFAULT 1.5 CHECK (rate_multiplier >= 1),
  amount numeric NOT NULL DEFAULT 0 CHECK (amount >= 0),
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period text NOT NULL,
  status payroll_status NOT NULL DEFAULT 'draft',
  total_gross numeric NOT NULL DEFAULT 0 CHECK (total_gross >= 0),
  total_deductions numeric NOT NULL DEFAULT 0 CHECK (total_deductions >= 0),
  total_net numeric NOT NULL DEFAULT 0 CHECK (total_net >= 0),
  employee_count int NOT NULL DEFAULT 0 CHECK (employee_count >= 0),
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (company_id, period)
);

CREATE TABLE payslips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  payroll_run_id uuid NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
  base_salary numeric NOT NULL DEFAULT 0 CHECK (base_salary >= 0),
  daily_pay numeric DEFAULT 0 CHECK (daily_pay >= 0),
  overtime_pay numeric DEFAULT 0 CHECK (overtime_pay >= 0),
  attendance_allowance numeric DEFAULT 0 CHECK (attendance_allowance >= 0),
  position_allowance numeric DEFAULT 0 CHECK (position_allowance >= 0),
  transport_allowance numeric DEFAULT 0 CHECK (transport_allowance >= 0),
  meal_allowance numeric DEFAULT 0 CHECK (meal_allowance >= 0),
  thr_amount numeric DEFAULT 0 CHECK (thr_amount >= 0),
  bonus numeric DEFAULT 0 CHECK (bonus >= 0),
  gross_salary numeric NOT NULL DEFAULT 0 CHECK (gross_salary >= 0),
  pph21 numeric DEFAULT 0 CHECK (pph21 >= 0),
  bpjs_kes numeric DEFAULT 0 CHECK (bpjs_kes >= 0),
  bpjs_tk numeric DEFAULT 0 CHECK (bpjs_tk >= 0),
  loan_deduction numeric DEFAULT 0 CHECK (loan_deduction >= 0),
  absence_deduction numeric DEFAULT 0 CHECK (absence_deduction >= 0),
  other_deductions numeric DEFAULT 0 CHECK (other_deductions >= 0),
  total_deductions numeric NOT NULL DEFAULT 0 CHECK (total_deductions >= 0),
  net_salary numeric NOT NULL DEFAULT 0 CHECK (net_salary >= 0),
  bank_name text,
  bank_account text,
  bank_transfer_ref text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, payroll_run_id)
);

CREATE TABLE thr_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  year int NOT NULL CHECK (year >= 2020),
  amount numeric NOT NULL CHECK (amount >= 0),
  months_worked int NOT NULL CHECK (months_worked BETWEEN 1 AND 12),
  is_full boolean NOT NULL DEFAULT true,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (employee_id, year)
);

CREATE TABLE ai_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  report_type text NOT NULL,
  ai_provider ai_provider NOT NULL,
  period text,
  summary text NOT NULL,
  recommendations jsonb,
  tokens_used int DEFAULT 0 CHECK (tokens_used >= 0),
  model_used text,
  response_time_ms int CHECK (response_time_ms IS NULL OR response_time_ms >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  category text NOT NULL,
  item_name text NOT NULL,
  status compliance_status NOT NULL DEFAULT 'compliant',
  description text,
  due_date date,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE safety_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  site_id uuid REFERENCES sites(id),
  incident_type incident_type NOT NULL,
  description text NOT NULL,
  root_cause text,
  action_taken text,
  incident_date date NOT NULL,
  reported_to_disnaker boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  cert_type cert_type NOT NULL,
  cert_number text,
  issued_date date,
  expiry_date date NOT NULL,
  status cert_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_cert_dates CHECK (expiry_date > issued_date)
);

-- ============================================================
-- 3. INDEXES (covering indexes for common query patterns)
-- ============================================================

-- Employees: lookup by company/site/status/department
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_employees_site ON employees(site_id);
CREATE INDEX idx_employees_status ON employees(status) WHERE status = 'active';
CREATE INDEX idx_employees_dept ON employees(department);
CREATE INDEX idx_employees_code ON employees(employee_code);
-- Requires pg_trgm extension: CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_employees_name ON employees USING gin(full_name gin_trgm_ops);
CREATE INDEX idx_employees_nik ON employees(nik);

-- Attendance: time-range queries (most common: daily/site reports)
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date DESC);
CREATE INDEX idx_attendance_site_date ON attendance(site_id, date DESC);

-- Payroll
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_run ON payslips(payroll_run_id);

-- Leave & Overtime
CREATE INDEX idx_leave_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_status ON leave_requests(status) WHERE status = 'pending';
CREATE INDEX idx_overtimes_employee ON overtimes(employee_id);

-- AI Reports
CREATE INDEX idx_ai_reports_company ON ai_reports(company_id, created_at DESC);
CREATE INDEX idx_ai_reports_type ON ai_reports(report_type);

-- Certifications: expiry tracking (most common: find expiring soon)
CREATE INDEX idx_certifications_employee ON certifications(employee_id);
CREATE INDEX idx_certifications_expiry ON certifications(expiry_date) WHERE status = 'active';
CREATE INDEX idx_certifications_type ON certifications(cert_type);

-- Safety incidents
CREATE INDEX idx_safety_incidents_date ON safety_incidents(incident_date DESC);
CREATE INDEX idx_safety_incidents_site ON safety_incidents(site_id, incident_date DESC);

-- ============================================================
-- 4. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own company" ON companies
  FOR ALL USING (
    EXISTS (SELECT 1 FROM employees WHERE company_id = companies.id AND user_id = auth.uid())
  );

CREATE POLICY "Users can access own site" ON sites
  FOR ALL USING (
    EXISTS (SELECT 1 FROM employees WHERE site_id = sites.id AND user_id = auth.uid())
  );

CREATE POLICY "Users can access own employees" ON employees
  FOR ALL USING (company_id IN (
    SELECT company_id FROM employees WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can access own attendance" ON attendance
  FOR ALL USING (employee_id IN (
    SELECT id FROM employees WHERE user_id = auth.uid()
  ));

-- ============================================================
-- 5. SEED DATA
-- ============================================================

INSERT INTO companies (id, name, slug) VALUES
  ('00000000-0000-0000-0000-000000000001', 'PT Tambang Indonesia', 'pt-tambang-indonesia');

INSERT INTO sites (id, company_id, name, location, is_remote, shift_pattern) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'Site A - Pit Utama', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'Site B - Pit Timur', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'Site C - Pit Barat', 'Kalimantan Timur', true, '7-3'),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', 'Site D - Overburden', 'Kalimantan Timur', true, '4-4'),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', 'Kantor Pusat', 'Jakarta', false, '5-2');
