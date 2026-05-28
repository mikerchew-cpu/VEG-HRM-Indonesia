"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { DEPARTMENTS, SITES, EMPLOYMENT_STATUSES } from "@/lib/constants/compliance";

interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  position: string;
  department: string;
  site_id: string;
  employment_status: string;
  status: string;
  nik: string;
  npwp: string;
  phone: string;
  base_salary: number;
  hire_date: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: "1", employee_code: "EMP-001", full_name: "Budi Santoso", position: "Excavator Operator", department: "Mining", site_id: "Site A - Pit Utama", employment_status: "pkwtt", status: "active", nik: "3273010101900001", npwp: "99.000.000.0-000.000", phone: "0812-3456-7890", base_salary: 8_500_000, hire_date: "2020-03-15" },
  { id: "2", employee_code: "EMP-002", full_name: "Siti Rahmawati", position: "Safety Officer", department: "HSE", site_id: "Site B - Pit Timur", employment_status: "pkwtt", status: "active", nik: "3273010102900002", npwp: "99.000.000.0-000.001", phone: "0813-3456-7890", base_salary: 9_200_000, hire_date: "2021-06-01" },
  { id: "3", employee_code: "EMP-003", full_name: "Ahmad Supriyadi", position: "Dump Truck Operator", department: "Mining", site_id: "Site A - Pit Utama", employment_status: "pkwt", status: "active", nik: "3273010103900003", npwp: "99.000.000.0-000.002", phone: "0814-3456-7890", base_salary: 7_800_000, hire_date: "2023-01-10" },
  { id: "4", employee_code: "EMP-004", full_name: "Dewi Lestari", position: "HR Staff", department: "HR", site_id: "Kantor Pusat", employment_status: "pkwtt", status: "active", nik: "3273010104900004", npwp: "99.000.000.0-000.003", phone: "0815-3456-7890", base_salary: 7_500_000, hire_date: "2022-09-20" },
  { id: "5", employee_code: "EMP-005", full_name: "Rudi Hartono", position: "Mekanik Alat Berat", department: "Maintenance", site_id: "Site C - Pit Barat", employment_status: "pkwt", status: "active", nik: "3273010105900005", npwp: "99.000.000.0-000.004", phone: "0816-3456-7890", base_salary: 8_000_000, hire_date: "2024-02-01" },
  { id: "6", employee_code: "EMP-006", full_name: "Joko Widodo", position: "Surveyor", department: "Survey", site_id: "Site D - Overburden", employment_status: "pkwt", status: "active", nik: "3273010106900006", npwp: "99.000.000.0-000.005", phone: "0817-3456-7890", base_salary: 9_000_000, hire_date: "2023-07-15" },
  { id: "7", employee_code: "EMP-007", full_name: "Mega Putri", position: "Finance Staff", department: "Finance", site_id: "Kantor Pusat", employment_status: "pkwtt", status: "active", nik: "3273010107900007", npwp: "99.000.000.0-000.006", phone: "0818-3456-7890", base_salary: 7_800_000, hire_date: "2021-11-01" },
  { id: "8", employee_code: "EMP-008", full_name: "Herman Susanto", position: "Logistic Staff", department: "Logistics", site_id: "Site B - Pit Timur", employment_status: "pkwtt", status: "suspended", nik: "3273010108900008", npwp: "99.000.000.0-000.007", phone: "0819-3456-7890", base_salary: 7_200_000, hire_date: "2022-04-10" },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      e.full_name.toLowerCase().includes(q) ||
      e.employee_code.toLowerCase().includes(q) ||
      e.nik.includes(q) ||
      e.position.toLowerCase().includes(q);
    const matchDept = !deptFilter || e.department === deptFilter;
    const matchSite = !siteFilter || e.site_id === siteFilter;
    const matchStatus = !statusFilter || e.status === statusFilter;
    return matchSearch && matchDept && matchSite && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-charcoal">Karyawan</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Kelola data seluruh karyawan — {filtered.length} dari {MOCK_EMPLOYEES.length} karyawan
          </p>
        </div>
        <Link
          href="/employees/add"
          className="px-4 py-2 bg-tiffany text-white text-sm font-medium rounded-lg hover:bg-tiffany-dark transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Karyawan
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIK, atau posisi..."
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
          />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany bg-white"
          >
            <option value="">Semua Departemen</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany bg-white"
          >
            <option value="">Semua Site</option>
            {SITES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany bg-white"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Nonaktif</option>
            <option value="terminated">Resign</option>
          </select>
        </div>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Karyawan", value: MOCK_EMPLOYEES.length, color: "text-tiffany" },
          { label: "Aktif", value: MOCK_EMPLOYEES.filter((e) => e.status === "active").length, color: "text-green-600" },
          { label: "Kontrak (PKWT)", value: MOCK_EMPLOYEES.filter((e) => e.employment_status === "pkwt").length, color: "text-warning" },
          { label: "Tetap (PKWTT)", value: MOCK_EMPLOYEES.filter((e) => e.employment_status === "pkwtt").length, color: "text-info" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Employee table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Kode</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Posisi</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Departemen</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Site</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 text-xs uppercase">Gaji Pokok</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 text-xs uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{emp.employee_code}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-tiffany-light rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-tiffany-dark">
                          {emp.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{emp.full_name}</p>
                        <p className="text-xs text-gray-400">NIK: {emp.nik}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{emp.position}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{emp.department}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{emp.site_id}</td>
                  <td className="px-4 py-3">
                    {emp.status === "active" ? (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">Aktif</span>
                    ) : emp.status === "suspended" ? (
                      <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">Nonaktif</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs font-medium">Resign</span>
                    )}
                    <span className="ml-1.5 text-xs text-gray-400">
                      {EMPLOYMENT_STATUSES[emp.employment_status as keyof typeof EMPLOYMENT_STATUSES]?.label.split(" (")[0]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-charcoal">{formatRupiah(emp.base_salary)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="text-tiffany hover:text-tiffany-dark text-xs font-medium"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
