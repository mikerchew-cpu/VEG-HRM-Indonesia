import { Card } from "@/components/ui/card";

const stats = [
  { label: "Total Employees", value: "1,284", change: "+12 this month" },
  { label: "Active Sites", value: "7", change: "3 remote sites" },
  { label: "Pending Payroll", value: "Rp 8.2B", change: "May 2026" },
  { label: "Compliance Alerts", value: "3", change: "2 critical" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-charcoal">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Overview of your mining HR operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-semibold text-charcoal mt-1">{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.change}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-medium text-charcoal mb-3">
            Recent Attendance
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            {["Site A — 98%", "Site B — 92%", "Site C — 87%", "Site D — 95%"].map(
              (site) => (
                <div
                  key={site}
                  className="flex justify-between py-1.5 border-b border-gray-100 last:border-0"
                >
                  <span>{site.split("—")[0].trim()}</span>
                  <span className="font-medium">{site.split("—")[1].trim()}</span>
                </div>
              )
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-charcoal mb-3">
            AI Insights
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-600">
              <span className="text-tiffany font-medium">2</span> payroll
              anomalies detected this period
            </p>
            <p className="text-gray-600">
              <span className="text-warning font-medium">5</span> compliance
              items require attention
            </p>
            <p className="text-gray-600">
              Turnover rate trending{" "}
              <span className="text-tiffany font-medium">down 12%</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
