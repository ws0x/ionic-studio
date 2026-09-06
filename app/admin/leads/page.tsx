"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lead, LeadStatus } from "@/lib/db";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; labelAr: string; color: string; bg: string }
> = {
  new: {
    label: "New",
    labelAr: "جديد",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
  },
  contacted: {
    label: "Contacted",
    labelAr: "تم التواصل",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
  },
  survey_scheduled: {
    label: "Survey Scheduled",
    labelAr: "معاينة موقع",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/30",
  },
  contract_signed: {
    label: "Contract Signed",
    labelAr: "تم التعاقد",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
  },
  lost: {
    label: "Archived / Lost",
    labelAr: "مؤرشف",
    color: "text-stone-400",
    bg: "bg-stone-800 border-stone-700",
  },
};

export default function LeadsCrmPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadForNotes, setSelectedLeadForNotes] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");

  const refreshLeads = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/leads")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ leads: [] })))
      .then((data) => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/leads")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ leads: [] })))
      .then((data) => {
        if (active) {
          setLeads(data.leads || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLeadForNotes) return;
    try {
      const res = await fetch(`/api/admin/leads/${selectedLeadForNotes.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteText }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLeadForNotes.id ? { ...l, notes: noteText } : l
          )
        );
        setSelectedLeadForNotes(null);
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete lead "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  const handleConvertToProject = async (leadId: string) => {
    try {
      const res = await fetch("/api/admin/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Lead successfully converted to Tracked Project (${data.project.referenceId})!`);
      } else {
        alert(data.error || "Failed to convert lead to project");
      }
    } catch {
      alert("Network error converting lead to project");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus =
      filterStatus === "all" ? true : lead.status === filterStatus;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      lead.name.toLowerCase().includes(query) ||
      lead.phone.includes(query) ||
      lead.referenceId.toLowerCase().includes(query) ||
      (lead.city && lead.city.toLowerCase().includes(query));
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    scheduled: leads.filter((l) => l.status === "survey_scheduled").length,
    signed: leads.filter((l) => l.status === "contract_signed").length,
  };

  const handleExportCsv = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const headers = [
      "Ref ID",
      "Date",
      "Name",
      "Phone",
      "Type",
      "Stage",
      "Area (m2)",
      "City",
      "Status",
      "Details",
      "Notes",
    ];

    const rows = filteredLeads.map((l) => [
      l.referenceId,
      new Date(l.createdAt).toLocaleDateString("en-GB"),
      `"${l.name.replace(/"/g, '""')}"`,
      l.phone,
      `"${(l.type || "").replace(/"/g, '""')}"`,
      `"${(l.stage || "").replace(/"/g, '""')}"`,
      l.area || "",
      `"${(l.city || "").replace(/"/g, '""')}"`,
      l.status,
      `"${(l.details || "").replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ionic-studio-leads-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Studio Operations
          </span>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Client Inquiries & CRM Pipeline
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={filteredLeads.length === 0}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>

          <button
            onClick={refreshLeads}
            className="p-2.5 bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 rounded-xl transition cursor-pointer"
            title="Refresh Leads"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
          <span className="text-xs text-stone-400 block mb-1">Total Leads</span>
          <span className="text-2xl font-mono text-stone-100 font-semibold">{stats.total}</span>
        </div>
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
          <span className="text-xs text-amber-400 block mb-1">New Inquiries</span>
          <span className="text-2xl font-mono text-amber-300 font-semibold">{stats.new}</span>
        </div>
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
          <span className="text-xs text-purple-400 block mb-1">Site Surveys</span>
          <span className="text-2xl font-mono text-purple-300 font-semibold">{stats.scheduled}</span>
        </div>
        <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-xl">
          <span className="text-xs text-emerald-400 block mb-1">Contracts Signed</span>
          <span className="text-2xl font-mono text-emerald-300 font-semibold">{stats.signed}</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-stone-900/40 p-4 rounded-xl border border-stone-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              filterStatus === "all"
                ? "bg-amber-500 text-stone-950 font-semibold"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
            }`}
          >
            All ({leads.length})
          </button>
          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((st) => {
            const count = leads.filter((l) => l.status === st).length;
            const cfg = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                  filterStatus === st
                    ? "bg-stone-800 text-stone-100 font-semibold ring-1 ring-amber-400/40"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/40"
                }`}
              >
                <span>{cfg.label}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, ref, city…"
            className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3.5 py-1.5 text-xs text-stone-100 placeholder-stone-400 outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            Loading leads pipeline…
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-sm">
            No leads match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-stone-300">
              <thead className="bg-stone-950/80 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                <tr>
                  <th className="p-4 text-start font-semibold">Ref / Date</th>
                  <th className="p-4 text-start font-semibold">Client</th>
                  <th className="p-4 text-start font-semibold">Project Spec</th>
                  <th className="p-4 text-start font-semibold">Status</th>
                  <th className="p-4 text-start font-semibold">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-normal">
                {filteredLeads.map((lead) => {
                  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                  const waText = `مرحباً ${lead.name}، معك دار أيونيك للتصميم بخصوص طلب الاستشارة رقم (${lead.referenceId}). هل يناسبك تحديد موعد للمعاينة الهندسية؟`;
                  const waLink = `https://wa.me/20${lead.phone.replace(/^0+/, "")}?text=${encodeURIComponent(waText)}`;

                  return (
                    <tr key={lead.id} className="hover:bg-stone-800/30 transition">
                      {/* Ref & Date */}
                      <td className="p-4 align-top">
                        <span className="font-mono text-amber-400/90 font-semibold block">
                          {lead.referenceId}
                        </span>
                        <span className="text-[11px] text-stone-400 block mt-0.5">
                          {new Date(lead.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      {/* Client */}
                      <td className="p-4 align-top">
                        <strong className="text-stone-100 text-sm block">
                          {lead.name}
                        </strong>
                        <a
                          href={`tel:${lead.phone}`}
                          className="font-mono text-stone-400 hover:text-amber-400 transition block mt-0.5"
                        >
                          {lead.phone}
                        </a>
                        {lead.city && (
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            📍 {lead.city}
                          </span>
                        )}
                      </td>

                      {/* Project Spec */}
                      <td className="p-4 align-top max-w-xs">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {lead.type && (
                            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]">
                              {lead.type}
                            </span>
                          )}
                          {lead.area && (
                            <span className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 text-[10px] font-mono">
                              {lead.area} m²
                            </span>
                          )}
                          {lead.stage && (
                            <span className="px-2 py-0.5 rounded bg-stone-800/70 text-stone-400 text-[10px]">
                              {lead.stage}
                            </span>
                          )}
                        </div>
                        {lead.details && (
                          <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                            {lead.details}
                          </p>
                        )}
                        {lead.notes && (
                          <p className="text-[11px] text-amber-300/90 italic mt-1 bg-amber-500/5 p-1 rounded border border-amber-500/10">
                            📝 {lead.notes}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4 align-top">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer ${cfg.bg} ${cfg.color}`}
                        >
                          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((st) => (
                            <option
                              key={st}
                              value={st}
                              className="bg-stone-900 text-stone-100"
                            >
                              {STATUS_CONFIG[st].label} ({STATUS_CONFIG[st].labelAr})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-1.5">
                          {/* WhatsApp */}
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition"
                            title="Chat on WhatsApp"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                            </svg>
                          </a>

                          {/* Notes */}
                          <button
                            onClick={() => {
                              setSelectedLeadForNotes(lead);
                              setNoteText(lead.notes || "");
                            }}
                            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition cursor-pointer"
                            title="Add/Edit Engineer Notes"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* Convert to Tracked Project */}
                          <button
                            onClick={() => handleConvertToProject(lead.id)}
                            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-400/30 rounded-lg transition cursor-pointer"
                            title="Convert to Active Tracked Project"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 rounded-lg transition cursor-pointer"
                            title="Delete Lead"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Engineer Notes Modal */}
      {selectedLeadForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 text-stone-100 shadow-2xl">
            <h3 className="text-lg font-light mb-1">
              Engineering Notes for {selectedLeadForNotes.name}
            </h3>
            <span className="text-xs text-amber-400 font-mono block mb-4">
              #{selectedLeadForNotes.referenceId}
            </span>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Record survey findings, agreed BOQ amendments, or client preferences…"
              className="w-full bg-stone-950 border border-stone-700 rounded-xl p-3 text-xs text-stone-100 placeholder-stone-400 outline-none focus:border-amber-400 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedLeadForNotes(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
