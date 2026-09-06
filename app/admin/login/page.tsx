"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const rolePresets = [
    { role: "admin", label: "Studio Director", pass: "ionic2026!", desc: "Full Executive Access" },
    { role: "engineer", label: "Site Engineer", pass: "site2026!", desc: "Project Tracker & Site Inspections" },
    { role: "sales", label: "Sales Consultant", pass: "sales2026!", desc: "Leads CRM & Consultations" },
  ];

  const handleSelectPreset = (preset: typeof rolePresets[0]) => {
    setUsername(preset.role);
    setPassword(preset.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      const destination = data.user?.defaultRoute || "/admin";
      router.push(destination);
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4 py-12 text-stone-100 selection:bg-amber-400 selection:text-stone-950">
      <div className="w-full max-w-md bg-stone-900/80 backdrop-blur-xl border border-stone-800 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <Link
            href="/"
            className="inline-block text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3 hover:text-amber-300 transition"
          >
            Ionic Design House
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-100">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-stone-400 mt-2">
            Multi-role operations workspace with Role-Based Access Control (RBAC).
          </p>
        </div>

        {/* Quick Role Selectors */}
        <div className="mb-6 p-3 rounded-xl bg-stone-950/60 border border-stone-800/80">
          <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold mb-2">
            Quick Role Presets
          </div>
          <div className="grid grid-cols-3 gap-2">
            {rolePresets.map((preset) => (
              <button
                key={preset.role}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-2 rounded-lg text-left transition text-xs border ${
                  username === preset.role
                    ? "bg-amber-500/10 border-amber-400/40 text-amber-300"
                    : "bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700"
                }`}
              >
                <div className="font-medium truncate">{preset.label}</div>
                <div className="text-[9px] opacity-70 truncate">{preset.role}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
              Account Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin, engineer, sales"
              required
              className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
              Access Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                required
                className="w-full bg-stone-950 border border-stone-700 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-stone-100 placeholder-stone-400 outline-none transition pe-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs px-1 py-1 cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm rounded-xl transition shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Authenticating…</span>
            ) : (
              <span>Enter Workspace</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800/80 text-center">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-stone-300 transition flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

