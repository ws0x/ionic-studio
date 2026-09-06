"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminSessionUser {
  username: string;
  name: string;
  role: string;
  title: string;
  titleAr: string;
  allowedRoutes: string[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data.authenticated && data.user) {
          setCurrentUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // If on login page, render without sidebar shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const allNavLinks = [
    {
      href: "/admin",
      label: "Overview",
      labelAr: "نظرة عامة",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      href: "/admin/leads",
      label: "Leads CRM",
      labelAr: "إدارة العملاء",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      href: "/admin/packages",
      label: "Finishing Rates",
      labelAr: "أسعار الباقات",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      href: "/admin/projects",
      label: "Projects",
      labelAr: "المشاريع",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      href: "/admin/before-after",
      label: "Before & After",
      labelAr: "قبل وبعد",
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    },
    {
      href: "/admin/tracker",
      label: "Project Tracker",
      labelAr: "تتبع المشاريع",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
    },
  ];

  // Role filtering
  const navLinks = allNavLinks.filter((item) => {
    if (!currentUser) return true; // fallback until loaded
    if (currentUser.role === "super_admin" || currentUser.role === "admin") return true;
    return currentUser.allowedRoutes?.some((r) => item.href === r || item.href.startsWith(r));
  });

  // Check if current route is unauthorized
  const isUnauthorized =
    !loading &&
    currentUser &&
    currentUser.role !== "super_admin" &&
    currentUser.role !== "admin" &&
    !currentUser.allowedRoutes?.some((r) => pathname === r || pathname.startsWith(r + "/"));

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case "site_engineer":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "sales_rep":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex md:w-64 flex-col border-e border-stone-800 bg-stone-900/60 backdrop-blur-xl p-5 shrink-0">
        <div className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              I
            </span>
            <div>
              <span className="font-medium text-stone-100 block text-sm tracking-tight">
                Ionic Design
              </span>
              <span className="text-[10px] text-amber-400/80 uppercase tracking-wider block">
                Admin Console
              </span>
            </div>
          </Link>

          {/* User profile card */}
          {currentUser && (
            <div className="mt-4 p-2.5 rounded-xl bg-stone-950/60 border border-stone-800/80">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-semibold text-stone-200 truncate">
                  {currentUser.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getRoleBadgeStyle(
                    currentUser.role
                  )}`}
                >
                  {currentUser.title}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? "bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/10"
                    : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-stone-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-xs text-stone-400 hover:text-stone-200 transition rounded-lg hover:bg-stone-800/40"
          >
            <svg className="w-4 h-4 text-amber-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Live Studio Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition rounded-lg hover:bg-red-950/20 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top Header (Mobile) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            I
          </span>
          <span className="text-sm font-medium">Ionic Admin</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-300 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-800 bg-stone-900/95 p-4 space-y-2">
          {currentUser && (
            <div className="px-3 py-2 text-xs border-b border-stone-800 mb-2">
              <span className="text-stone-200 font-medium block">{currentUser.name}</span>
              <span className="text-amber-400 text-[11px]">{currentUser.title}</span>
            </div>
          )}
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-300 hover:bg-stone-800"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
            <Link href="/" target="_blank" className="text-amber-400">
              Live Site ↗
            </Link>
            <button onClick={handleLogout} className="text-red-400">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-y-auto">
        {isUnauthorized ? (
          <div className="max-w-lg mx-auto mt-16 p-8 rounded-2xl bg-stone-900/80 border border-stone-800 text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-stone-100 mb-2">
              Access Restricted
            </h2>
            <p className="text-xs text-stone-400 mb-6 leading-relaxed">
              Your current role ({currentUser?.title}) does not have permission to access this module. Please switch to your authorized workspace.
            </p>
            {currentUser?.allowedRoutes?.[0] && (
              <Link
                href={currentUser.allowedRoutes[0]}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold transition"
              >
                Go to Authorized Workspace
              </Link>
            )}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

