"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/providers/language-provider";
import { REGULATIONS, REGULATION_CATEGORIES } from "@/lib/constants/regulations";

export default function HelpDeskPage() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"kb" | "enquiry" | "docs">("kb");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedReg, setExpandedReg] = useState<string | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({ subject: "", category: "", message: "", priority: "medium" });
  const [enquiries, setEnquiries] = useState<{ id: number; subject: string; category: string; status: string; date: string }[]>([]);
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<{ name: string; size: string; type: string; date: string }[]>([]);

  const isId = lang === "id";

  const filteredRegs = REGULATIONS.filter((r) => {
    const title = isId ? r.title.toLowerCase() : r.titleEn.toLowerCase();
    const summary = isId ? r.summary.toLowerCase() : r.summaryEn.toLowerCase();
    const cat = isId ? r.category.toLowerCase() : r.categoryEn.toLowerCase();
    const q = searchQuery.toLowerCase();
    return (
      title.includes(q) || summary.includes(q) || cat.includes(q) || r.type.includes(q) || String(r.year).includes(q)
    ) && (!selectedCategory || r.category === selectedCategory || r.categoryEn === selectedCategory);
  });

  function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnquiries((prev) => [
      { id: Date.now(), subject: enquiryForm.subject, category: enquiryForm.category, status: "open", date: new Date().toISOString().slice(0, 10) },
      ...prev,
    ]);
    setEnquirySubmitted(true);
    setEnquiryForm({ subject: "", category: "", message: "", priority: "medium" });
    setTimeout(() => setEnquirySubmitted(false), 3000);
  }

  function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      const size = file.size > 1024 * 1024
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : (file.size / 1024).toFixed(0) + " KB";
      setUploadedDocs((prev) => [
        { name: file.name, size, type: file.type || "application/octet-stream", date: new Date().toISOString().slice(0, 10) },
        ...prev,
      ]);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--foreground)]">{t("nav.helpdesk")}</h1>
        <p className="text-sm text-[var(--muted-fg)] mt-0.5">
          {isId ? "Knowledge Base HR, pengajuan enquiry, dan manajemen dokumen" : "HR Knowledge Base, enquiry submissions, and document management"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: "kb" as const, label: isId ? "Knowledge Base" : "Knowledge Base" },
          { id: "enquiry" as const, label: isId ? "Pengajuan Enquiry" : "Submit Enquiry" },
          { id: "docs" as const, label: isId ? "Upload Dokumen" : "Documents" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === t.id
                ? "bg-tiffany text-white"
                : "bg-[var(--card)] border border-[var(--card-border)] text-[var(--muted-fg)] hover:bg-[var(--muted)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Knowledge Base Tab */}
      {activeTab === "kb" && (
        <div className="space-y-4">
          {/* Search and filter */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isId ? "Cari peraturan, judul, atau tahun..." : "Search regulations, titles, or year..."}
                className="px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
              >
                <option value="">{isId ? "Semua Kategori" : "All Categories"}</option>
                {REGULATION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{isId ? cat : REGULATIONS.find((r) => r.category === cat)?.categoryEn ?? cat}</option>
                ))}
              </select>
              <div className="text-xs text-[var(--muted-fg)] flex items-center">
                {isId
                  ? `${filteredRegs.length} peraturan ditemukan`
                  : `${filteredRegs.length} regulations found`}
              </div>
            </div>
          </Card>

          {/* Regulation list */}
          <div className="space-y-3">
            {filteredRegs.map((reg) => (
              <Card key={reg.id} className="p-0 overflow-hidden">
                <button
                  onClick={() => setExpandedReg(expandedReg === reg.id ? null : reg.id)}
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        reg.type === "law" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        reg.type === "government-regulation" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        reg.type === "minister-regulation" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        reg.type === "finance-regulation" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {isId
                          ? (reg.type === "law" ? "UU" : reg.type === "government-regulation" ? "PP" : reg.type === "minister-regulation" ? "Permenaker" : reg.type === "finance-regulation" ? "PMK" : "Pedoman")
                          : (reg.type === "law" ? "Law" : reg.type === "government-regulation" ? "GR" : reg.type === "minister-regulation" ? "Minister Reg" : reg.type === "finance-regulation" ? "Finance Reg" : "Guideline")}
                      </span>
                      <span className="text-xs text-[var(--muted-fg)]">{reg.year}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        reg.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        reg.status === "amended" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-gray-100 text-gray-500 dark:bg-gray-900/30 dark:text-gray-400"
                      }`}>
                        {isId
                          ? (reg.status === "active" ? "Aktif" : reg.status === "amended" ? "Diubah" : "Diganti")
                          : (reg.status === "active" ? "Active" : reg.status === "amended" ? "Amended" : "Replaced")}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-[var(--foreground)]">
                      {isId ? reg.title : reg.titleEn}
                    </h3>
                    <p className="text-xs text-[var(--muted-fg)] mt-1">
                      {isId ? reg.category : reg.categoryEn}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 text-[var(--muted-fg)] shrink-0 transition-transform ${expandedReg === reg.id ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedReg === reg.id && (
                  <div className="px-5 pb-4 border-t border-[var(--card-border)]">
                    <p className="text-sm text-[var(--foreground)] mt-3 leading-relaxed">
                      {isId ? reg.summary : reg.summaryEn}
                    </p>
                    <h4 className="text-xs font-semibold text-[var(--foreground)] mt-3 mb-2">
                      {isId ? "Poin Penting:" : "Key Points:"}
                    </h4>
                    <ul className="space-y-1">
                      {(isId ? reg.keyPoints : reg.keyPointsEn).map((point, i) => (
                        <li key={i} className="text-xs text-[var(--muted-fg)] flex items-start gap-2">
                          <span className="text-tiffany mt-0.5">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enquiry Tab */}
      {activeTab === "enquiry" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              {isId ? "Kirim Enquiry Baru" : "Submit New Enquiry"}
            </h2>

            {enquirySubmitted && (
              <div className="p-3 bg-tiffany-light rounded-lg mb-4 text-xs text-tiffany-dark">
                {isId ? "✓ Enquiry berhasil dikirim. Tim kami akan merespon dalam 1-2 hari kerja." : "✓ Enquiry submitted successfully. Our team will respond within 1-2 business days."}
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">
                  {isId ? "Subjek" : "Subject"}
                </label>
                <input
                  type="text"
                  value={enquiryForm.subject}
                  onChange={(e) => setEnquiryForm((p) => ({ ...p, subject: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
                  placeholder={isId ? "Contoh: Perhitungan THR 2025" : "Example: THR Calculation 2025"}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">
                  {isId ? "Kategori" : "Category"}
                </label>
                <select
                  value={enquiryForm.category}
                  onChange={(e) => setEnquiryForm((p) => ({ ...p, category: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
                >
                  <option value="">{isId ? "Pilih kategori..." : "Select category..."}</option>
                  {REGULATION_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{isId ? cat : REGULATIONS.find((r) => r.category === cat)?.categoryEn ?? cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">
                  {isId ? "Prioritas" : "Priority"}
                </label>
                <select
                  value={enquiryForm.priority}
                  onChange={(e) => setEnquiryForm((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany"
                >
                  <option value="low">{isId ? "Rendah" : "Low"}</option>
                  <option value="medium">{isId ? "Sedang" : "Medium"}</option>
                  <option value="high">{isId ? "Tinggi" : "High"}</option>
                  <option value="urgent">{isId ? "Urgent" : "Urgent"}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted-fg)] mb-1">
                  {isId ? "Pertanyaan" : "Message"}
                </label>
                <textarea
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm((p) => ({ ...p, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-[var(--input)] bg-[var(--card)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tiffany resize-none"
                  placeholder={isId ? "Jelaskan pertanyaan atau masalah Anda..." : "Describe your question or issue..."}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-tiffany text-white text-sm font-medium rounded-lg hover:bg-tiffany-dark transition-colors"
              >
                {isId ? "Kirim Enquiry" : "Submit Enquiry"}
              </button>
            </form>
          </Card>

          {/* Enquiry history */}
          <Card>
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              {isId ? "Riwayat Enquiry" : "Enquiry History"}
            </h2>
            {enquiries.length === 0 ? (
              <div className="text-center py-10 text-[var(--muted-fg)]">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">{isId ? "Belum ada enquiry" : "No enquiries yet"}</p>
                <p className="text-xs mt-1">{isId ? "Kirim enquiry pertama Anda" : "Submit your first enquiry"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {enquiries.map((eq) => (
                  <div key={eq.id} className="p-3 border border-[var(--card-border)] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[var(--foreground)]">{eq.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded font-medium">
                        {isId ? "Terbuka" : "Open"}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-fg)]">{eq.category} · {eq.date}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "docs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              {isId ? "Upload Dokumen" : "Upload Documents"}
            </h2>
            <div className="border-2 border-dashed border-[var(--card-border)] rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                onChange={handleDocUpload}
                className="hidden"
                id="doc-upload"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
              />
              <label htmlFor="doc-upload" className="cursor-pointer">
                <p className="text-3xl mb-2">📄</p>
                <p className="text-sm text-[var(--foreground)] font-medium">
                  {isId ? "Klik untuk upload dokumen" : "Click to upload documents"}
                </p>
                <p className="text-xs text-[var(--muted-fg)] mt-1">
                  {isId ? "PDF, Word, Excel, atau gambar (max 10MB)" : "PDF, Word, Excel, or images (max 10MB)"}
                </p>
              </label>
            </div>
            {uploadedDocs.length > 0 && (
              <div className="mt-4 p-3 bg-tiffany-light rounded-lg">
                <p className="text-xs text-tiffany-dark font-medium">
                  {isId ? `${uploadedDocs.length} dokumen terupload` : `${uploadedDocs.length} documents uploaded`}
                </p>
              </div>
            )}
          </Card>

          {/* Uploaded files list */}
          <Card>
            <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
              {isId ? "Dokumen Terupload" : "Uploaded Documents"}
            </h2>
            {uploadedDocs.length === 0 ? (
              <div className="text-center py-10 text-[var(--muted-fg)]">
                <p className="text-3xl mb-2">📁</p>
                <p className="text-sm">{isId ? "Belum ada dokumen" : "No documents yet"}</p>
                <p className="text-xs mt-1">{isId ? "Upload dokumen kebijakan HR, SOP, atau regulasi" : "Upload HR policy documents, SOPs, or regulations"}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {uploadedDocs.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-[var(--card-border)] rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg">📄</span>
                      <div className="min-w-0">
                        <p className="text-sm text-[var(--foreground)] truncate">{doc.name}</p>
                        <p className="text-xs text-[var(--muted-fg)]">{doc.size} · {doc.date}</p>
                      </div>
                    </div>
                    <button className="text-xs text-tiffany hover:underline shrink-0">
                      {isId ? "Download" : "Download"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
