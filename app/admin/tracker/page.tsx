"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { ClientProject, ProjectMilestone, ProjectStageKey } from "@/lib/db";

export default function AdminTrackerPage() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedProj, setSelectedProj] = useState<ClientProject | null>(null);
  const [activeModal, setActiveModal] = useState<"site_update" | "milestones" | "new_proj" | null>(null);

  // New site update form state
  const [updateTitleEn, setUpdateTitleEn] = useState("");
  const [updateTitleAr, setUpdateTitleAr] = useState("");
  const [updateNotesEn, setUpdateNotesEn] = useState("");
  const [updateNotesAr, setUpdateNotesAr] = useState("");
  const [updateImageUrl, setUpdateImageUrl] = useState("");
  const [updatePhase, setUpdatePhase] = useState<ProjectStageKey>("civil_plaster");
  const [engineerName, setEngineerName] = useState("Eng. Ahmed El-Sherif");
  const [submittingUpdate, setSubmittingUpdate] = useState(false);
  const [notifyClient, setNotifyClient] = useState(true);

  // Milestone edit state
  const [editingMilestones, setEditingMilestones] = useState<ProjectMilestone[]>([]);
  const [savingMilestones, setSavingMilestones] = useState(false);
  const [notifyMilestones, setNotifyMilestones] = useState(true);

  // New Project form state
  const [newRef, setNewRef] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newType, setNewType] = useState("Villa");
  const [newArea, setNewArea] = useState("250 m²");
  const [newCompoundEn, setNewCompoundEn] = useState("");
  const [newCompoundAr, setNewCompoundAr] = useState("");
  const [newCityEn, setNewCityEn] = useState("New Cairo");
  const [newCityAr, setNewCityAr] = useState("القاهرة الجديدة");
  const [newHandover, setNewHandover] = useState("2026-06-30");
  const [creatingProj, setCreatingProj] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/tracker")
      .then((res) => (res.ok ? res.json() : Promise.resolve({ projects: [] })))
      .then((data) => {
        if (active) {
          setProjects(data.projects || []);
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

  const openSiteUpdateModal = (proj: ClientProject) => {
    setSelectedProj(proj);
    setUpdateTitleEn("");
    setUpdateTitleAr("");
    setUpdateNotesEn("");
    setUpdateNotesAr("");
    setUpdateImageUrl("");
    setUpdatePhase(proj.currentStage);
    setEngineerName(proj.siteEngineer.name || "Lead Engineer");
    setNotifyClient(true);
    setActiveModal("site_update");
  };

  const openMilestonesModal = (proj: ClientProject) => {
    setSelectedProj(proj);
    setEditingMilestones(JSON.parse(JSON.stringify(proj.milestones)));
    setNotifyMilestones(true);
    setActiveModal("milestones");
  };

  const handlePostSiteUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProj) return;

    setSubmittingUpdate(true);
    try {
      const res = await fetch(`/api/admin/tracker/${selectedProj.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          title: { ar: updateTitleAr || updateTitleEn, en: updateTitleEn },
          notes: { ar: updateNotesAr || updateNotesEn, en: updateNotesEn },
          imageUrl: updateImageUrl,
          phase: updatePhase,
          engineerName,
          notifyClient,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) =>
            p.id === selectedProj.id
              ? { ...p, siteUpdates: [data.update, ...p.siteUpdates] }
              : p
          )
        );
        setActiveModal(null);
      } else {
        alert("Failed to post site update");
      }
    } catch {
      alert("Network error posting update");
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleSaveMilestones = async () => {
    if (!selectedProj) return;

    // Calculate average progress
    const avgProgress = Math.round(
      editingMilestones.reduce((acc, m) => acc + m.progress, 0) / editingMilestones.length
    );

    setSavingMilestones(true);
    try {
      const res = await fetch(`/api/admin/tracker/${selectedProj.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestones: editingMilestones,
          overallProgress: avgProgress,
          notifyClient: notifyMilestones,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) =>
          prev.map((p) => (p.id === selectedProj.id ? data.project : p))
        );
        setActiveModal(null);
      } else {
        alert("Failed to save milestones");
      }
    } catch {
      alert("Network error updating milestones");
    } finally {
      setSavingMilestones(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingProj(true);

    try {
      const res = await fetch("/api/admin/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId: newRef,
          clientName: newName,
          clientPhone: newPhone,
          unitType: newType,
          area: newArea,
          compound: { ar: newCompoundAr || newCompoundEn, en: newCompoundEn },
          city: { ar: newCityAr, en: newCityEn },
          targetHandoverDate: newHandover,
          overallProgress: 15,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProjects((prev) => [data.project, ...prev]);
        setActiveModal(null);
        setNewRef("");
        setNewName("");
        setNewPhone("");
        setNewCompoundEn("");
        setNewCompoundAr("");
      } else {
        alert("Failed to create project");
      }
    } catch {
      alert("Network error creating project");
    } finally {
      setCreatingProj(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block mb-1">
            Execution & Site Operations
          </span>
          <h1 className="text-3xl font-light text-stone-100 tracking-tight">
            Client Project Progress & Site Tracker
          </h1>
          <p className="text-stone-400 text-xs mt-1.5 max-w-2xl">
            Supervise active architectural finishing sites across Egypt, adjust milestone progress, and publish live photo feeds.
          </p>
        </div>

        <button
          onClick={() => setActiveModal("new_proj")}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-semibold shadow-lg shadow-amber-500/10 transition shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Tracked Project
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-stone-400 text-sm">
          Loading project sites...
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl group hover:border-stone-700 transition"
            >
              {/* Project Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                      {p.referenceId}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      {p.unitType} · {p.area}
                    </span>
                  </div>

                  <h2 className="text-xl font-medium text-stone-100">
                    {p.compound.en} · {p.city.en} ({p.clientName})
                  </h2>

                  <p className="text-xs text-stone-400 mt-1">
                    Supervising Engineer: <strong className="text-stone-300">{p.siteEngineer.name}</strong> ({p.siteEngineer.phone})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href={`/track?id=${p.referenceId}`}
                    target="_blank"
                    className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 hover:border-amber-400/50 text-stone-300 text-xs font-medium transition"
                  >
                    Client View ↗
                  </Link>

                  <button
                    onClick={() => openMilestonesModal(p)}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 text-xs font-medium transition cursor-pointer"
                  >
                    Adjust Milestones
                  </button>

                  <button
                    onClick={() => openSiteUpdateModal(p)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition cursor-pointer"
                  >
                    + Post Site Photo
                  </button>
                </div>
              </div>

              {/* Progress Summary Bar */}
              <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-300 font-medium">Overall Execution Progress</span>
                  <span className="font-mono text-amber-400 font-bold">{p.overallProgress}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-stone-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-700"
                    style={{ width: `${p.overallProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-500 font-mono pt-1">
                  <span>Contract: {p.contractDate}</span>
                  <span>Target Handover: {p.targetHandoverDate}</span>
                </div>
              </div>

              {/* Recent Site Photos Preview */}
              {p.siteUpdates.length > 0 && (
                <div className="pt-2 border-t border-stone-800/80">
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-3">
                    Latest Site Reports ({p.siteUpdates.length} Total)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {p.siteUpdates.slice(0, 3).map((upd) => (
                      <div key={upd.id} className="p-3 bg-stone-950/40 rounded-xl border border-stone-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                          <span>{upd.date}</span>
                          <span className="text-amber-400 uppercase">{upd.phase}</span>
                        </div>
                        <h4 className="font-medium text-stone-200 truncate">{upd.title.en}</h4>
                        <p className="text-[11px] text-stone-400 line-clamp-2">{upd.notes.en}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal: Post Site Update */}
      {activeModal === "site_update" && selectedProj && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold block">{selectedProj.referenceId}</span>
                <h2 className="text-lg font-medium text-stone-100">Post Field Inspection Update</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-200">✕</button>
            </div>

            <form onSubmit={handlePostSiteUpdate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Update Title (EN)</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Master bathroom plumbing pressure test passed"
                  value={updateTitleEn}
                  onChange={(e) => setUpdateTitleEn(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Update Title (AR)</label>
                <input
                  type="text"
                  placeholder="مثال: اجتياز اختبار ضغط شبكة تغذية الحمام الرئيسي"
                  value={updateTitleAr}
                  onChange={(e) => setUpdateTitleAr(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Site Notes (EN)</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Details on engineering tests, materials inspected, or next scheduled trades..."
                  value={updateNotesEn}
                  onChange={(e) => setUpdateNotesEn(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Site Notes (AR)</label>
                <textarea
                  rows={2}
                  placeholder="تفاصيل التفتيش الهندسي ومطابقة الكود وتاريخ بدء البند التالي..."
                  value={updateNotesAr}
                  onChange={(e) => setUpdateNotesAr(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                />
              </div>

              <div>
                <ImageUploader
                  label="Site Progress Photo (High-Res)"
                  value={updateImageUrl}
                  onChange={setUpdateImageUrl}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Active Phase</label>
                  <select
                    value={updatePhase}
                    onChange={(e) => setUpdatePhase(e.target.value as ProjectStageKey)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs text-stone-200"
                  >
                    <option value="concept_design">Design & 3D</option>
                    <option value="mep_rough_in">MEP Rough-in</option>
                    <option value="civil_plaster">Plaster & Civil</option>
                    <option value="woodwork_finishes">Finishes & Joinery</option>
                    <option value="snagging_handover">Snagging & Handover</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Inspecting Engineer</label>
                  <input
                    type="text"
                    value={engineerName}
                    onChange={(e) => setEngineerName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs text-stone-200"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-stone-200 block">Dispatch Client Notification</span>
                  <span className="text-[11px] text-stone-400 block">Send instant WhatsApp/SMS inspection alert to {selectedProj.clientPhone}</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyClient}
                  onChange={(e) => setNotifyClient(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingUpdate}
                  className="px-5 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg text-xs hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {submittingUpdate ? "Publishing..." : "Publish Site Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Adjust Milestones */}
      {activeModal === "milestones" && selectedProj && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold block">{selectedProj.referenceId}</span>
                <h2 className="text-lg font-medium text-stone-100">Adjust Stage Milestones</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-200">✕</button>
            </div>

            <div className="space-y-5">
              {editingMilestones.map((m, idx) => (
                <div key={m.id} className="p-3.5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-200">{m.title.en}</span>
                    <span className="font-mono text-amber-400 font-semibold">{m.progress}%</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={m.progress}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setEditingMilestones((prev) =>
                        prev.map((item, i) =>
                          i === idx
                            ? {
                                ...item,
                                progress: val,
                                status: val === 100 ? "completed" : val > 0 ? "in_progress" : "pending",
                              }
                            : item
                        )
                      );
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-stone-200 block">Notify Homeowner of Milestone Advance</span>
                <span className="text-[11px] text-stone-400 block">Send progress percentage alert with direct tracking link</span>
              </div>
              <input
                type="checkbox"
                checked={notifyMilestones}
                onChange={(e) => setNotifyMilestones(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
              />
            </div>


            <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMilestones}
                disabled={savingMilestones}
                className="px-5 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg text-xs hover:bg-amber-400 transition disabled:opacity-50"
              >
                {savingMilestones ? "Saving..." : "Save Progress"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Project */}
      {activeModal === "new_proj" && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <h2 className="text-lg font-medium text-stone-100">Create New Tracked Client Project</h2>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-200">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Ref ID</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ION-8840"
                    value={newRef}
                    onChange={(e) => setNewRef(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 font-mono outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Client Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Omar Sherif"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Phone</label>
                  <input
                    required
                    type="tel"
                    placeholder="+2010..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 font-mono outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Unit Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  >
                    <option value="Stand-Alone Villa">Stand-Alone Villa</option>
                    <option value="Twin House">Twin House</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Luxury Apartment">Luxury Apartment</option>
                    <option value="Executive Office">Executive Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Area (m²)</label>
                  <input
                    type="text"
                    placeholder="e.g. 350 m²"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Target Handover</label>
                  <input
                    type="date"
                    value={newHandover}
                    onChange={(e) => setNewHandover(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 font-mono outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Compound (EN)</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Palm Hills"
                    value={newCompoundEn}
                    onChange={(e) => setNewCompoundEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">Compound (AR)</label>
                  <input
                    type="text"
                    placeholder="مثال: بالم هيلز"
                    value={newCompoundAr}
                    onChange={(e) => setNewCompoundAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">City (EN)</label>
                  <input
                    type="text"
                    value={newCityEn}
                    onChange={(e) => setNewCityEn(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase text-stone-400 font-semibold mb-1">City (AR)</label>
                  <input
                    type="text"
                    value={newCityAr}
                    onChange={(e) => setNewCityAr(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-xs text-stone-100 outline-none focus:border-amber-400 text-end"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProj}
                  className="px-5 py-2 bg-amber-500 text-stone-950 font-semibold rounded-lg text-xs hover:bg-amber-400 transition disabled:opacity-50"
                >
                  {creatingProj ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
