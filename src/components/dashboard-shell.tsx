"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Activity,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  Moon,
  PanelLeftClose,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { useSession } from "@/components/session-provider";
import { initials, timeAgo, cn } from "@/lib/utils";
import { useToast } from "@/components/ui";
import { ChatBot } from "@/components/chatbot";

type Role = "admin" | "teacher" | "student" | "parent";
type NavItem = { href: string; label: string; icon: typeof LayoutDashboard; roles: Role[] };
type NotificationItem = { id: string; title: string; message: string; isRead: boolean; createdAt: string; type: string; link?: string | null };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  { label: "Workspace", items: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/courses", label: "Courses", icon: BookOpen, roles: ["admin", "teacher", "student", "parent"] },
  ] },
  { label: "Learning", items: [
    { href: "/dashboard/assignments", label: "Assignments", icon: FileText, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/attendance", label: "Attendance", icon: CalendarDays, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/grades", label: "Gradebook", icon: ChartNoAxesCombined, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/edulearn", label: "EduLearn", icon: GraduationCap, roles: ["student"] },
    { href: "/dashboard/study-pod", label: "AI Study Pod", icon: Sparkles, roles: ["admin", "teacher", "student", "parent"] },
  ] },
  { label: "Community", items: [
    { href: "/dashboard/announcements", label: "Announcements", icon: Megaphone, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/insights", label: "AI Insights", icon: Activity, roles: ["admin", "teacher", "student", "parent"] },
    { href: "/dashboard/reports", label: "Reports", icon: ChartNoAxesCombined, roles: ["admin", "teacher"] },
    { href: "/dashboard/users", label: "Administration", icon: ShieldCheck, roles: ["admin"] },
  ] },
];

function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-[13px] bg-[#173d3d] text-[12px] font-semibold tracking-tight text-white">E.</span>{!compact && <span className="text-[14px] font-semibold tracking-[-0.04em] text-[#1b3234]">EduMentor<span className="text-[#668476]"> AI</span></span>}</span>;
}

function ThemeIcon() {
  return <><Moon aria-hidden="true" className="workspace-theme-moon size-[17px]" /><Sun aria-hidden="true" className="workspace-theme-sun size-[17px]" /></>;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const user = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingOut, setLoadingOut] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const currentItem = NAV_GROUPS.flatMap((group) => group.items).find((item) => item.href === pathname);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleDarkMode() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/notifications?limit=8");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setNotifications(data.notifications ?? []);
      } catch {
        // Notifications are optional and should not interrupt workspace navigation.
      }
    }
    load();
    const interval = setInterval(load, 20000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) setBellOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  async function markAllRead() {
    setNotifications((previous) => previous.map((notification) => ({ ...notification, isRead: true })));
    try { await fetch("/api/notifications/read-all", { method: "PATCH" }); } catch { /* Keep the local acknowledgement visible. */ }
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

  const sidebarContent = (
    <div className="flex h-full flex-col px-4 pb-4 pt-5">
      <div className="mb-8 flex items-center justify-between px-1"><Link href="/dashboard" aria-label="EduMentor dashboard" onClick={() => setMobileOpen(false)}><Brand /></Link><button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-[#788783] hover:bg-[#eff3ee] lg:hidden" aria-label="Close navigation"><X aria-hidden="true" className="size-4" /></button><span className="hidden size-8 items-center justify-center rounded-lg text-[#91a098] lg:flex"><PanelLeftClose aria-hidden="true" className="size-4" /></span></div>
      <div className="mb-5 rounded-[14px] border border-[#e6ece5] bg-[#f5f7f3] px-3.5 py-3"><p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#819089]">Your workspace</p><div className="mt-2 flex items-center gap-2"><span className="size-2 rounded-full bg-[#6ea37c]" /><span className="text-[11px] font-medium capitalize text-[#3d5650]">{user.role} account</span></div></div>
      <nav aria-label="Workspace navigation" className="flex-1 overflow-y-auto pb-4">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter((item) => item.roles.includes(user.role));
          if (!visibleItems.length) return null;
          return <div key={group.label} className="mb-6"><p className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9aa59e]">{group.label}</p><div className="flex flex-col gap-1">{visibleItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} aria-current={active ? "page" : undefined} className={cn("group flex min-h-10 items-center gap-3 rounded-[10px] px-3 text-[12px] font-medium transition-colors", active ? "bg-[#eaf2e9] text-[#2c5b48]" : "text-[#667570] hover:bg-[#f2f5f0] hover:text-[#2f4c43]")}><Icon aria-hidden="true" className={cn("size-[16px] shrink-0", active ? "text-[#4e8065]" : "text-[#8a9890] group-hover:text-[#557c67]")} />{item.label}{active && <ChevronRight aria-hidden="true" className="ml-auto size-3.5 text-[#77a083]" />}</Link>;
          })}</div></div>;
        })}
      </nav>
      <div className="border-t border-[#e9ede8] pt-3"><Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-[#f3f6f1]"><span className="flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ backgroundColor: user.avatarColor }}>{initials(user.name)}</span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold text-[#304446]">{user.name}</span><span className="mt-0.5 block truncate text-[10px] capitalize text-[#86928b]">{user.role}</span></span><Settings2 aria-hidden="true" className="size-4 text-[#91a098]" /></Link><button type="button" onClick={handleLogout} disabled={loadingOut} className="mt-1 flex min-h-9 w-full items-center gap-3 rounded-[10px] px-3 text-[11px] font-medium text-[#74817b] transition-colors hover:bg-[#fbf0ed] hover:text-[#a35447] disabled:opacity-60"><LogOut aria-hidden="true" className="size-4" />{loadingOut ? "Signing out…" : "Sign out"}</button></div>
    </div>
  );

  return (
    <div className="workspace-shell min-h-screen bg-[#f6f8f5] text-[#203638] selection:bg-[#d8eadf] selection:text-[#173d3d] transition-colors">
      <div className="flex min-h-screen">
        {mobileOpen && <button type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-[#122c2c]/25 backdrop-blur-[2px] lg:hidden" />}
        <aside className={cn("workspace-sidebar z-50 w-[252px] shrink-0 border-r border-[#e6ebe5] bg-[#fbfcfa] transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:block lg:h-screen lg:translate-x-0", mobileOpen ? "fixed inset-y-0 left-0 translate-x-0" : "fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0")}>{sidebarContent}</aside>
        <div className="min-w-0 flex-1">
          <header className="workspace-topbar sticky top-0 z-30 flex h-[66px] items-center justify-between border-b border-[#e6ebe5] bg-[#fbfcfa]/95 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
            <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => setMobileOpen(true)} className="flex size-9 shrink-0 items-center justify-center rounded-[10px] border border-[#e4eae3] bg-white text-[#65746d] transition hover:bg-[#f3f6f2] lg:hidden" aria-label="Open navigation"><Menu aria-hidden="true" className="size-4" /></button><div className="min-w-0"><p className="truncate text-[10px] text-[#95a098]">EduMentor <span className="px-1 text-[#c2cbc3]">/</span> <span className="capitalize">{currentItem?.label ?? "Workspace"}</span></p><p className="mt-0.5 truncate text-[12px] font-semibold text-[#34494a]">Good to see you, {user.name.split(" ")[0]}</p></div></div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3"><button type="button" onClick={toggleDarkMode} className="flex size-9 items-center justify-center rounded-[10px] border border-[#e4eae3] bg-white text-[#78867f] transition hover:bg-[#f3f6f2]" title="Toggle color theme" aria-label="Toggle color theme"><ThemeIcon /></button><div className="relative" ref={bellRef}><button type="button" onClick={() => setBellOpen((value) => !value)} className="relative flex size-9 items-center justify-center rounded-[10px] border border-[#e4eae3] bg-white text-[#78867f] transition hover:bg-[#f3f6f2]" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={bellOpen}><Bell aria-hidden="true" className="size-[17px]" />{unreadCount > 0 && <span className="absolute -right-1 -top-1 flex min-h-[16px] min-w-[16px] items-center justify-center rounded-full border-2 border-[#fbfcfa] bg-[#c66d5c] px-1 text-[8px] font-bold text-white">{unreadCount}</span>}</button>{bellOpen && <div className="absolute right-0 z-50 mt-2 w-[min(340px,calc(100vw-32px))] overflow-hidden rounded-[16px] border border-[#e4eae3] bg-white shadow-[0_18px_50px_-20px_rgba(26,51,41,.25)]"><div className="flex items-center justify-between border-b border-[#eef1ed] px-4 py-3"><div><p className="text-[12px] font-semibold text-[#2b4242]">Notifications</p><p className="mt-0.5 text-[9px] text-[#89958e]">Updates for your workspace</p></div>{unreadCount > 0 && <button type="button" onClick={markAllRead} className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#4f7d64] hover:text-[#254c3c]"><Check aria-hidden="true" className="size-3.5" /> Mark all read</button>}</div><div className="max-h-[360px] overflow-y-auto p-2">{notifications.length === 0 ? <p className="px-3 py-8 text-center text-[11px] text-[#909b94]">You&apos;re all caught up.</p> : notifications.map((notification) => <div key={notification.id} className={cn("rounded-[11px] px-3 py-2.5 transition hover:bg-[#f7f9f6]", !notification.isRead && "bg-[#f1f6ef]")}><p className="text-[11px] font-semibold text-[#354a49]">{notification.title}</p><p className="mt-1 text-[10px] leading-4 text-[#76837d]">{notification.message}</p><div className="mt-2 flex items-center justify-between"><span className="text-[9px] text-[#a0aaa3]">{timeAgo(notification.createdAt)}</span>{notification.type === "study_pod_invite" && <Link href="/dashboard/study-pod" onClick={() => setBellOpen(false)} className="text-[9px] font-semibold text-[#4f7d64] hover:underline">Open study pod <ChevronRight aria-hidden="true" className="ml-1 inline size-3" /></Link>}</div></div>)}</div></div>}</div><Link href="/dashboard/profile" aria-label="Open your profile" className="ml-1 flex items-center gap-2.5 rounded-full p-1 transition hover:bg-[#f1f4ef]"><span className="hidden text-right sm:block"><span className="block text-[10px] font-semibold text-[#34494a]">{user.name}</span><span className="mt-0.5 block text-[9px] capitalize text-[#8a9690]">{user.role}</span></span><span className="flex size-8 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: user.avatarColor }}>{initials(user.name)}</span></Link></div>
          </header>
          <main className="workspace-content mx-auto min-h-[calc(100vh-66px)] max-w-[1440px] px-4 py-6 sm:px-6 sm:py-7 lg:px-9 lg:py-9">{children}</main>
        </div>
      </div>
      <ChatBot userRole={user.role} userName={user.name} />
    </div>
  );
}
