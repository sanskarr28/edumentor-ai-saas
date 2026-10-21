"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useSession } from "@/components/session-provider";
import { initials, roleBadgeClasses, timeAgo, cn } from "@/lib/utils";
import { useToast } from "@/components/ui";
import { ChatBot } from "@/components/chatbot";

type NavItem = {
  href: string;
  label: string;
  icon: "overview" | "courses" | "assignments" | "attendance" | "grades" | "insights" | "learn" | "studyPod" | "announcements" | "reports" | "admin";
  roles: Array<"admin" | "teacher" | "student" | "parent">;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "overview", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/courses", label: "Courses", icon: "courses", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/assignments", label: "Assignments", icon: "assignments", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/attendance", label: "Attendance", icon: "attendance", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/grades", label: "Gradebook", icon: "grades", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/insights", label: "AI Insights", icon: "insights", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/edulearn", label: "EduLearn", icon: "learn", roles: ["student"] },
  { href: "/dashboard/study-pod", label: "AI Study Pod", icon: "studyPod", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/announcements", label: "Announcements", icon: "announcements", roles: ["admin", "teacher", "student", "parent"] },
  { href: "/dashboard/reports", label: "Reports", icon: "reports", roles: ["admin", "teacher"] },
  { href: "/dashboard/users", label: "Administration", icon: "admin", roles: ["admin"] },
];

const NAV_ICON_PATHS: Record<NavItem["icon"], string> = {
  overview: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  courses: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zm0 0V21m4-14h8m-8 4h8",
  assignments: "M8 4h8m-8 4h8m-8 4h5m-9 9V3h16v18z",
  attendance: "M4 5h16v16H4zm4-3v6m8-6v6M4 10h16m-11 5 2 2 4-4",
  grades: "M4 19V5m0 14h17M8 15l3-4 3 2 5-7",
  insights: "M12 3l2.1 5.9L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-2.1zM19 16v5m-2.5-2.5h5",
  learn: "M3 5.5A2.5 2.5 0 0 1 5.5 3H12v17H5.5A2.5 2.5 0 0 0 3 22zm18 0A2.5 2.5 0 0 0 18.5 3H12v17h6.5a2.5 2.5 0 0 1 2.5 2z",
  studyPod: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75",
  announcements: "M4 14V9l14-5v15L4 14zm0 0-1 5h5l2-3m13-7v7",
  reports: "M4 20V4m0 16h17M8 16v-4m5 4V7m5 9v-6",
  admin: "M12 3 4 6v5c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6zm-3 9 2 2 4-4",
};

function NavIcon({ name }: { name: NavItem["icon"] }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[18px] w-[18px] shrink-0"> <path d={NAV_ICON_PATHS[name]} /></svg>;
}

function ThemeIcon({ darkMode }: { darkMode: boolean }) {
  return darkMode ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
    </svg>
  );
}

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: string;
  link?: string | null;
};

export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingOut, setLoadingOut] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (isDark) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  }

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/notifications?limit=8");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setNotifications(data.notifications ?? []);
      } catch {
        // ignore
      }
    }
    load();
    const interval = setInterval(load, 20000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
    } catch {
      // ignore
    }
  }

  async function handleLogout() {
    setLoadingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      push("Signed out successfully", "success");
      router.push("/login");
      router.refresh();
    } catch {
      push("Failed to sign out", "error");
      setLoadingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f6fa] dark:bg-[#080C14] text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 transition-colors">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B111E] px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-950 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white shadow-md shadow-blue-900/15">E</span>
          EduMentor <span className="-ml-2 text-blue-700">AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-1 rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon darkMode={darkMode} />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={cn(
            "z-40 w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0B111E] lg:sticky lg:top-0 lg:block lg:h-screen transition-colors",
            mobileOpen ? "block" : "hidden",
          )}
        >
          <div className="flex h-full flex-col px-3.5 py-6">
            <Link href="/dashboard" className="mb-9 hidden items-center gap-3 px-2 text-[15px] font-semibold tracking-tight text-slate-950 dark:text-white lg:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-sm font-bold text-white shadow-md shadow-blue-900/15">E</span>
              EduMentor <span className="-ml-2 text-blue-700">AI</span>
            </Link>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
            <nav aria-label="Workspace navigation" className="flex-1 space-y-1">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all",
                      active
                        ? "bg-blue-50 text-blue-800 ring-1 ring-blue-100 dark:bg-slate-800/80 dark:text-blue-400 dark:ring-1 dark:ring-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-950 dark:hover:text-slate-100",
                    )}
                  >
                    <NavIcon name={item.icon} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 border-t border-slate-200/80 pt-4">
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-50"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {initials(user.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="truncate text-xs capitalize text-slate-500">{user.role}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                disabled={loadingOut}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
              >
                <span aria-hidden="true">↪</span> {loadingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-[#0B111E]/90 px-8 py-3.5 backdrop-blur-xl lg:flex transition-colors">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Your workspace</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">Welcome back, {user.name.split(" ")[0]}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                <ThemeIcon darkMode={darkMode} />
                <span>{darkMode ? "Light mode" : "Dark mode"}</span>
              </button>

              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold capitalize", roleBadgeClasses(user.role))}>
                {user.role}
              </span>
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen((v) => !v)}
                  className="relative rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  aria-label="Notifications"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl">
                    <div className="flex items-center justify-between px-2 py-1">
                      <p className="text-sm font-semibold text-slate-800">Notifications</p>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="text-xs font-medium text-indigo-600 hover:underline">
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-2 py-6 text-center text-xs text-slate-400">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "rounded-lg px-2.5 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800/80",
                              !n.isRead && "bg-indigo-50/70 dark:bg-indigo-950/40",
                            )}
                          >
                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-xs">{n.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                            <div className="mt-1 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500">{timeAgo(n.createdAt)}</span>
                              {n.type === "study_pod_invite" && (
                                <Link
                                  href="/dashboard/study-pod"
                                  onClick={() => setBellOpen(false)}
                                  className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-indigo-700 transition"
                                >
                                  Respond in Pod →
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <ChatBot userRole={user.role} userName={user.name} />
    </div>
  );
}
