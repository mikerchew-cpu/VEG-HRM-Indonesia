# Indonesia HRM Web App — Mining Industry Framework

## Market Research Summary

### Key Competitors in Indonesia
| Platform | Focus | Key Strength |
|----------|-------|-------------|
| **Mekari Talenta** | General HCM + Mining | AI analytics, face recognition, GPS attendance, EWA |
| **Gadjian** | Payroll & HRIS | PPh 21/BPJS automation, multilevel approval, asset mgmt |
| **Hashmicro** | HRMS | Modular, compliance-focused |
| **Sleekr** | SME HRIS | Simple, affordable |
| **Pegawe (Fast8)** | Payroll outsourcing | EOR/manpower outsourcing |

### Mining Industry HR Pain Points (from research)
1. **Remote site attendance** — no internet, no fingerprint machines
2. **Dynamic shift rosters** — 24/7 operations, rotating crews
3. **Multi-site management** — HQ + multiple pit/site locations
4. **Heavy compliance** — UU Cipta Kerja, UMP/UMR, BPJS Kesehatan & Ketenagakerjaan, PPh 21, PP 36/2021
5. **Blue-collar heavy workforce** — daily wage, piece-rate, overtime complexity
6. **Health & safety (SMK3)** — mining permits, medical checks, incident reporting
7. **High turnover & seasonal workers** — contract-based employment
8. **Earned Wage Access (EWA)** — workers need earlier wage access
9. **Low digital literacy** — simple UI, offline-capable mobile apps

---

## Proposed App Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Presentation Layer                       │
│  Web App (React/Next.js)  │  Mobile App (React Native)   │
│  ─ Admin Dashboard        │  ─ Employee Self-Service     │
│  ─ HR Manager Panel       │  ─ Site Attendance (Offline) │
│  ─ AI Report Viewer       │  ─ Request Cuti/Lembur       │
├──────────────────────────────────────────────────────────┤
│                    API Gateway (REST/GraphQL)             │
├──────────────────────────────────────────────────────────┤
│                   Application Layer                       │
│  ┌──────────┬──────────┬──────────┬─────────────────────┐ │
│  │ Core HR  │ Payroll  │ Time &   │ Talent              │ │
│  │ Module   │ Module   │Attendance│ Management          │ │
│  ├──────────┼──────────┼──────────┼─────────────────────┤ │
│  │ Comp &   │ EH&S     │ Contract │ AI Analysis &       │ │
│  │ Benefit  │ Module   │ & Vendor │ Recommendation      │ │
│  │ (BPJS,   │ (SMK3,   │ Mgmt     │ Engine              │ │
│  │ PPh 21)  │ Medical) │          │                     │ │
│  └──────────┴──────────┴──────────┴─────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│                    AI Provider Abstraction Layer           │
│  ┌──────────┬──────────┬──────────┬─────────────────────┐ │
│  │ DeepSeek │  Claude  │  Gemini  │  Plugin / Custom    │ │
│  │ (API)    │ (API)    │ (API)    │  (Ollama, local)    │ │
│  └──────────┴──────────┴──────────┴─────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│                    Service Layer                           │
│  Auth (JWT/OAuth2) │ Notification │ File Storage │ Queue   │
├──────────────────────────────────────────────────────────┤
│                    Data Layer                              │
│  PostgreSQL │ Redis (Cache) │ S3/MinIO (Docs) │ Vector DB │
│              │              │                │ (pgvector) │
├──────────────────────────────────────────────────────────┤
│                 Indonesia Regulatory Engine                │
│  ─ UU Ketenagakerjaan (Cipta Kerja) auto-update           │
│  ─ UMP/UMR per provinsi/kabupaten database                │
│  ─ BPJS rate tables (Kesehatan 5%, Ketenagakerjaan ~8.24%)│
│  ─ PPh 21 TER (Tarif Efektif Rata-rata) 2024              │
│  ─ THR calculation engine                                 │
│  ─ Pesangon (severance) calculator (PP 35/2021)           │
└──────────────────────────────────────────────────────────┘
```

---

## Recommended Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Go (performance) or Node.js/NestJS (rapid dev) |
| **Frontend Web** | Next.js + Tailwind + Shadcn/ui |
| **Mobile** | React Native (Expo) — offline-first with SQLite sync |
| **Database** | PostgreSQL (relational) + pgvector (embeddings) |
| **Cache** | Redis |
| **Queue** | RabbitMQ / Bull (payroll processing, notifications, AI jobs) |
| **File Storage** | MinIO / AWS S3 (for contracts, KTP, photos) |
| **Auth** | JWT + OAuth2 (Google, email/password) |
| **Maps** | Mapbox / Google Maps (site tracking) |
| **Analytics** | Apache Superset / Metabase (self-serve dashboards) |
| **AI Provider SDK** | DeepSeek SDK, Anthropic SDK, Google AI SDK (unified provider interface) |
| **Vector DB** | pgvector (PostgreSQL extension) for RAG and semantic search |
| **Deployment** | Docker + Kubernetes, CI/CD with GitHub Actions |
| **Offline-first** | PWA + React Native with WatermelonDB or Realm |

---

## Module Breakdown

### 1. Core HR (Employee Database)
- Employee profiles (KTP, NPWP, BPJS, KK, tax status)
- Organizational structure (org chart with drag & drop)
- Job grading & salary scales (sesuai Permenaker 1/2017)
- Document management (contracts, certificates, medical records)
- Multi-company / multi-site hierarchy
- Manpower planning & budgeting
- Employee self-service (ESS) — update profile, view pay slips, submit requests

### 2. Time & Attendance
- **Offline attendance** — face recognition + GPS, stores locally, syncs when online
- **Shift management** — 24/7 rotating shifts, roster patterns (4/4, 4/2, 7/3 etc.)
- **Live tracking** — real-time GPS tracking for field workers
- **Overtime management** — automated calculation per UU, digital SP (surat perintah)
- **Leave management** — cuti tahunan, cuti sakit, izin, cuti hamil, cuti bersama
- **Timesheet** — daily activity logging for site workers
- Integration with fingerprint machines (Mesin Fingerprint)

### 3. Payroll & Compensation
- **Payroll calculation engine** — monthly, daily, hourly, piece-rate
- **PPh 21/26 calculation** — TER (Tarif Efektif Rata-rata) 2024, automatic CSV for e-Bupot
- **BPJS Kesehatan (5%) & BPJS Ketenagakerjaan (~8.24%)** — auto calculation
- **THR (Holiday Allowance)** — prorata calculation
- **Severance (Pesangon)** — PP 35/2021 compliance
- **Overtime pay** — 1.5x first hour, 2x subsequent hours (UU Cipta Kerja)
- **Earned Wage Access (EWA)** — allow workers to draw earned wages early
- **Reimbursement & expense management**
- **Payslip distribution** — digital, mobile-accessible
- **Payroll disbursement** — integrated with bank partners (Flip, BCA, Mandiri)
- **Payroll reports** — monthly, annual, per-site

### 4. Talent Management
- **Recruitment (ATS)** — job posting, candidate tracking, CV scoring with AI
- **Onboarding & offboarding** — digital checklists, document signing
- **Performance management** — KPI, OKR, 360° review
- **Learning Management System (LMS)** — safety training, competency tests
- **Succession planning** — talent pool, career path
- **Training & certification tracking** — POP, POU, SIO (mining-specific certs)

### 5. Compliance & Regulatory (Indonesia-specific)
- **UMP/UMR database** — per provinsi, updated annually
- **UUK Cipta Kerja compliance engine** — PKWT (contract), PKWTT (permanent), outsourcing rules
- **BPJS rate auto-update** — when government changes rates
- **PPh 21 TER 2024 engine** — monthly effective rates, annual reconciliation
- **e-Bupot integration** — with DJP Coretax system
- **PP 35/2021** — severance, long-service pay, compensation
- **THR engine** — religious holiday allowance per UU
- **Wage structure** — SK Upah, grading per Permenaker 1/2017
- **Manpower reporting** — to Ministry of Manpower (Wajib Lapor Ketenagakerjaan)

### 6. Mining-Specific Features (Differentiator)
- **SMK3 (Sistem Manajemen K3)** — safety incident reporting, HIRADC
- **Medical check-up scheduling & tracking** — POP/POU medical exams
- **Heavy equipment operator certification tracking** — SIO, SIMB
- **Site-to-HQ rotation management** — crew logistics, accommodation
- **Contractor/vendor management** — outsourced mining services
- **Mining permit compliance** — IUP, IUPK, production reports
- **Geofencing** — attendance validation within site boundaries
- **Emergency response system** — muster point check-in, evacuation tracking
- **Fatigue management** — hours-of-work limits, rest period tracking

### 7. Analytics & AI
- **HR dashboards** — headcount, turnover, absenteeism, overtime cost
- **Demographic analysis** — age, tenure, gender distribution
- **Payroll analytics** — cost per site, labor cost vs budget
- **Predictive analytics** — turnover risk, attendance patterns
- **AI chatbot** — employee FAQ, policy lookup, policy-aware answers via RAG
- **CV scoring** — automated candidate ranking
- **Compliance alerts** — expiring contracts, certifications, medical checks
- **AI Analysis & Recommendation Engine** (see Module 9 for full spec)

### 8. Integration Ecosystem
- **Bank partners** — Flip, BCA, Mandiri, BNI (payroll disbursement)
- **ERP integration** — accounting (Jurnal, Accurate, SAP)
- **Fingerprint/attendance machines** — Hadirr, BioSmart, etc.
- **Tax filing** — Coretax DJP, Klikpajak, e-Bupot
- **BPJS online** — automatic iuran reporting
- **Payment gateways** — Midtrans, Xendit (for worker benefits purchases)

---

### 9. AI Analysis & Recommendation Engine (Multi-LLM)

#### 9.1 Architecture — AI Provider Abstraction Layer

```
┌─────────────────────────────────────────────────────────────┐
│              AI Analysis & Recommendation Engine             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │            AI Provider Abstraction Layer             │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────┐  │    │
│  │  │ DeepSeek │  │  Claude  │  │  Gemini  │  │Custom│  │    │
│  │  │ Chat API │  │ Messages │  │Gen AI SDK│  │Plugin│  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └────┘  │    │
│  │                                                     │    │
│  │  Unified Interface:                                  │    │
│  │  ─ prompt(messages, model, options) → response       │    │
│  │  ─ stream(messages, model, options) → async response │    │
│  │  ─ embed(text, provider) → vector                    │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                    RAG Pipeline                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│
│  │ Document │→ │ Chunking │→ │Embedding │→ │ Vector Store  ││
│  │ Loader   │  │ & Split  │  │ (pgvec)  │  │ + Semantic    ││
│  │          │  │          │  │          │  │   Search      ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘│
├─────────────────────────────────────────────────────────────┤
│                 Prompt Management System                     │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Role Prompts │  │ Report       │  │ Output Validators   │ │
│  │ (analyst,    │  │ Templates    │  │ (JSON Schema,       │ │
│  │  reviewer)   │  │ (structured  │  │  structured output) │ │
│  │              │  │  output)     │  │                     │ │
│  └──────────────┘  └──────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 9.2 AI Provider Configuration

| Provider | Model(s) | Use Case | Notes |
|----------|----------|----------|-------|
| **DeepSeek** | deepseek-chat, deepseek-reasoner | Financial analysis, compliance checks, payroll anomaly detection | Best for structured data reasoning, cost-effective |
| **Claude (Anthropic)** | claude-sonnet-4, claude-haiku | Narrative reports, recommendation letters, employee performance summaries | Best for long-form writing, nuanced HR communication |
| **Gemini (Google)** | gemini-2.5-flash, gemini-2.5-pro | Real-time analytics, multimodal (chart/photo analysis), site photo inspection | Best for vision (site safety photos, KTP scans) |
| **Custom / Local** | Ollama (Llama 3, Qwen) | On-premise deployment for sensitive mining data | Air-gapped site requirement |

#### 9.3 Analysis Report Types

| Report | Description | AI Provider | Frequency |
|--------|-------------|-------------|-----------|
| **Payroll Anomaly Report** | Detects unusual payroll patterns, miscalculations, outliers | DeepSeek (reasoning) | Per payroll cycle |
| **Turnover Risk Analysis** | Predicts flight-risk employees, recommends retention actions | Claude (narrative) | Monthly |
| **Compliance Health Check** | Scans all employees for BPJS, PPh 21, PKWT expiry, mining cert gaps | DeepSeek (structured) | Weekly |
| **Workforce Cost Optimization** | Analyzes labor cost per site, OT spend, contractor vs permanent cost | DeepSeek → Claude | Monthly |
| **Safety Incident Trend Report** | Analyzes incident patterns, root causes, recommends interventions | Gemini (multimodal) + Claude (narrative) | Per incident + quarterly |
| **Shift Efficiency Analysis** | Evaluates roster patterns, fatigue risk, overtime distribution | DeepSeek | Monthly |
| **Employee Performance Summary** | Synthesizes KPI, attendance, training data into narrative review | Claude | Quarterly |
| **Site Productivity Analysis** | Cross-references headcount, attendance, production output | DeepSeek | Monthly |
| **Certification & Training Gap** | Identifies expired/expiring certs, recommends training plan | DeepSeek | Weekly |
| **Manpower Planning Forecast** | Projects hiring needs based on turnover, production targets, permits | DeepSeek + Claude | Quarterly |
| **Regulatory Change Impact** | Summarizes new regulations (PP, Permenaker), assesses company impact | Gemini (fast research) | On update |

#### 9.4 User Experience — Report Interface

```
┌─────────────────────────────────────────────────────────────┐
│  📊 AI Analysis Report Center                               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Generate New Report                                  │    │
│  │                                                       │    │
│  │  Report Type: [Payroll Anomaly ▼]                     │    │
│  │  Period:      [May 2026 ▼]                            │    │
│  │  Scope:       [All Sites ▼]                           │    │
│  │  AI Model:    [DeepSeek ▼]     ⚙️ Configure Models   │    │
│  │                                                       │    │
│  │  [Generate Report]   [Schedule Recurring]              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  AI Model Selector (admin)                           │    │
│  │                                                       │    │
│  │  ☑ DeepSeek  ─── API Key: ●●●●●●●●●●  [Test] [Edit] │    │
│  │  ☑ Claude    ─── API Key: ●●●●●●●●●●  [Test] [Edit] │    │
│  │  ☐ Gemini    ─── API Key: ────────────  [Add Key]    │    │
│  │  ☐ Custom    ─── Endpoint: http://192.168.x.x:11434  │    │
│  │                                                       │    │
│  │  Default for Analytics: [DeepSeek  ▼]                 │    │
│  │  Default for Reports:   [Claude    ▼]                 │    │
│  │  Default for Images:    [Gemini    ▼]                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Latest Report: Payroll Anomaly — May 2026           │    │
│  │  Generated by: DeepSeek (0:32s)  [Regenerate w/     │    │
│  │                                    Claude ▼]         │    │
│  │                                                       │    │
│  │  ⚠️ 3 anomalies detected:                             │    │
│  │  1. Site B overtime cost 40% above budget             │    │
│  │  2. 12 workers missing BPJS contributions (2 months)  │    │
│  │  3. Overtime cap exceeded for 8 operators             │    │
│  │                                                       │    │
│  │  [View Full Report] [Export PDF] [Share]               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.5 Multi-Model Comparison (Cross-Validation)

Users can generate the same report with different AI providers and compare results:

```
┌─────────────────────────────────────────────────────────────┐
│  Cross-Model Validation: Compliance Health Check             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  DeepSeek  │  │  Claude   │  │  Gemini   │               │
│  ├───────────┤  ├───────────┤  ├───────────┤               │
│  │ ✅ Found  │  │ ✅ Found  │  │ ✅ Found  │               │
│  │ 3 issues  │  │ 3 issues  │  │ 4 issues  │               │
│  │           │  │           │  │           │               │
│  │ 1. BPJS   │  │ 1. BPJS   │  │ 1. BPJS   │               │
│  │ 2. PKWT   │  │ 2. PKWT   │  │ 2. PKWT   │               │
│  │ 3. SIO    │  │ 3. SIO    │  │ 3. SIO    │               │
│  │           │  │           │  │ 4. PPh 21 │               │
│  └───────────┘  └───────────┘  └───────────┘               │
│                                                              │
│  Consensus: 3 issues confirmed across all models             │
│  Discrepancy: PPh 21 flagged only by Gemini — review manual │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### 9.6 RAG Knowledge Base Contents
- Company policies (PK, Peraturan Perusahaan)
- Indonesian labor laws (UU, PP, Permenaker)
- Mining regulations (Permen ESDM)
- BPJS & tax manuals
- Collective Labor Agreements (PKB)
- Historical HR reports
- Industry benchmark data

#### 9.7 Security & Privacy
- **API keys** stored encrypted at rest (AES-256), never exposed to frontend
- **Data masking** — PII (KTP, salary) sanitized before sending to LLM
- **On-premise option** — Ollama for air-gapped mining sites
- **Audit log** — every AI request/report logged with provider, tokens, timestamp
- **Opt-out** — per-company toggle to disable cloud AI providers
- **Data retention** — prompts/responses purged after 30 days (configurable)

---

## Design System & Color Scheme

### Color Palette (Tiffany & Co. inspired — from tiffany.my)

Tiffany & Co. uses a premium, elegant design language centered around their iconic robin's-egg blue. This palette translates well into a professional HRM app — conveying trust, clarity, and sophistication.

| Token | Hex | Usage |
|-------|-----|-------|
| `--tiffany-blue` | `#0ABAB5` | Primary brand color — buttons, active states, links, header accents |
| `--tiffany-blue-dark` | `#089B97` | Hover states, active buttons |
| `--tiffany-blue-light` | `#E6F7F6` | Subtle backgrounds, table row stripes, alert banners |
| `--white` | `#FFFFFF` | Card backgrounds, modal surfaces, sidebar |
| `--black` | `#000000` | Primary text |
| `--charcoal` | `#1A1A1A` | Secondary text, headings |
| `--gray-900` | `#2D2D2D` | Body text |
| `--gray-600` | `#737373` | Muted text, labels, placeholders |
| `--gray-200` | `#E5E5E5` | Borders, dividers, disabled states |
| `--gray-50` | `#F5F5F5` | Page backgrounds, input backgrounds |
| `--success` | `#0ABAB5` | Success states (uses brand color) |
| `--warning` | `#F5A623` | Warning alerts |
| `--danger` | `#E74C3C` | Error states, critical alerts |
| `--info` | `#3498DB` | Informational banners |

```
/* Tailwind CSS v4 / CSS Variables */
:root {
  --color-tiffany: #0ABAB5;
  --color-tiffany-dark: #089B97;
  --color-tiffany-light: #E6F7F6;
  --color-charcoal: #1A1A1A;
  --color-gray-900: #2D2D2D;
  --color-gray-600: #737373;
  --color-gray-200: #E5E5E5;
  --color-gray-50: #F5F5F5;
}
```

### Visual Design Principles
- **Generous whitespace** — mimics Tiffany's clean, premium product pages
- **Minimalist navigation** — top nav with mega-menu pattern (like tiffany.my)
- **Card-based layouts** — subtle shadows, rounded corners (12px radius)
- **Centered login/auth screens** — single-column, minimal distraction
- **Product-style employee cards** — large photo, name, role at top (like product display)
- **Micro-animations** — subtle fades, scale on hover (premium feel)
- **Typography**: Clean sans-serif (Inter or plus jakarta sans), black text on white, tiffany-blue for CTAs
- **High-contrast ratios** — accessibility compliant (WCAG AA)

### UI/UX Recommendations for Mining

- **Dark mode default** — used in site offices against glare
- **Large touch targets** — gloved hands in field
- **Offline-first** — critical for remote sites with intermittent connectivity
- **Simple language** — Indonesian language primary, English secondary
- **QR/barcode scanning** — for attendance, equipment check-out
- **Voice input support** — low-literacy workers
- **Push notifications** — payroll ready, training due, medical expired
- **Photo/KTP capture** — for onboarding & verification

---

## Project Phases (Recommended)

| Phase | Scope | Timeline |
|-------|-------|----------|
| **P1MVP** | Core HR + Attendance (offline GPS) + Payroll + PPh 21/BPJS | 3-4 months |
| **P2** | Leave/Overtime + ESS mobile + Shift management | +2 months |
| **P3** | Recruitment/ATS + Performance + LMS + **AI Provider abstraction + RAG pipeline** | +3 months |
| **P4** | EH&S (SMK3) + Mining-specific (geofence, certs, fatigue) | +3 months |
| **P5** | **AI Analysis & Recommendation Engine** (all report types, multi-model compare) + EWA + Full integration ecosystem | +3 months |

---

## Key Compliance Reference

| Regulation | Description | App Impact |
|-----------|-------------|------------|
| **UU 6/2023 (Cipta Kerja)** | Omnibus law on employment | PKWT max 5 years, severance rules, outsourcing limits |
| **PP 35/2021** | Termination, severance, compensation | Pesangon, PMTK, UPH calculation |
| **PP 36/2021** | Wages | UMP/UMR, wage structure, minimum wage |
| **Permenaker 1/2017** | Wage structure & scale | Grading system, SK Upah |
| **Permenaker 16/2015** | BPJS procedure | BPJS rates & reporting |
| **PPh 21 PER-1/PJ/2024** | TER rate system | Monthly effective tax rates |
| **UU 1/1970 + PP 50/2012** | SMK3 (Safety) | Incident reporting, HIRADC |
| **Permen ESDB 26/2018** | Mining safety & certs | SIO, POP, POU certification |
