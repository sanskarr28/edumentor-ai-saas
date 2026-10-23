"use client";

import { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  Shield,
  CheckCircle2,
  TrendingUp,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  UploadCloud,
  CheckCheck,
} from "lucide-react";

type RoleKey = "student" | "faculty" | "parent" | "admin";

interface RoleData {
  key: RoleKey;
  label: string;
  badge: string;
  icon: typeof GraduationCap;
  title: string;
  subtitle: string;
  highlights: string[];
  mockup: {
    heading: string;
    subheading: string;
    metrics: { label: string; value: string; detail: string }[];
    feedTitle: string;
    feedItems: { title: string; meta: string; tag: string; tagColor: string }[];
  };
}

const ROLES_DATA: Record<RoleKey, RoleData> = {
  student: {
    key: "student",
    label: "Student",
    badge: "Personalized Learner Portal",
    icon: GraduationCap,
    title: "Master your courses with conversational rigor",
    subtitle:
      "Cross-examine complex theories in multi-agent AI pods, upload assignment files with direct S3 verification, and follow your GPA progression in real time.",
    highlights: [
      "Engage Elena, Alex, and Dr. Marcus in Socratic defense pods",
      "Direct S3 presigned PDF and document assignment submissions",
      "Longitudinal GPA and attendance tracking with predictive alerts",
      "Collaborative peer chat with class cohort members",
    ],
    mockup: {
      heading: "Student Learning Command",
      subheading: "Enrolled in 6 Accredited Courses • Spring 2026",
      metrics: [
        { label: "Current GPA", value: "3.94", detail: "Top 5% of class" },
        { label: "Attendance Rate", value: "98.4%", detail: "All requirements met" },
        { label: "Pod Defenses", value: "14 Done", detail: "Avg score: 93.8%" },
      ],
      feedTitle: "Upcoming Assignments & Active Pods",
      feedItems: [
        {
          title: "Quantum Mechanics — Bohr Orbitals Synthesis",
          meta: "Defense scheduled • AI Pod active with 2 peers",
          tag: "Study Pod",
          tagColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        },
        {
          title: "Differential Equations — Problem Set 4",
          meta: "Due tomorrow at 11:59 PM • PDF submission ready",
          tag: "Assignment",
          tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        },
        {
          title: "Organic Chemistry — Spectrometry Analysis",
          meta: "Graded: 98/100 • Feedback from Prof. Davis available",
          tag: "Graded",
          tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        },
      ],
    },
  },
  faculty: {
    key: "faculty",
    label: "Faculty & Teachers",
    badge: "Academic Management Engine",
    title: "Orchestrate curriculum, grading, and direct student outreach",
    subtitle:
      "Publish courses, distribute lecture notes via secure S3 storage, review submissions with speed, and broadcast announcements to entire class sections.",
    icon: BookOpen,
    highlights: [
      "Upload course files and syllabi with zero proxy overhead",
      "Interactive grading modal with weighted rubric scoring",
      "Monitor student engagement and study pod defense participation",
      "Broadcast course announcements with instant student notifications",
    ],
    mockup: {
      heading: "Faculty Course Dashboard",
      subheading: "Managing 4 Sections • 142 Active Enrolled Students",
      metrics: [
        { label: "Active Sections", value: "4 Courses", detail: "100% syllabus coverage" },
        { label: "Pending Submissions", value: "12 to Grade", detail: "Avg turnaround 1.2d" },
        { label: "Class Avg Mastery", value: "88.6%", detail: "+3.4% over last term" },
      ],
      feedTitle: "Recent Submissions Awaiting Evaluation",
      feedItems: [
        {
          title: "Maya Patel — Quantum Duality Defense Paper",
          meta: "Submitted 22m ago • 4.2 MB PDF via AWS S3",
          tag: "Needs Review",
          tagColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        },
        {
          title: "Alex Chen — Cournot Duopoly Analysis",
          meta: "Submitted 1h ago • Evaluated by Study Pod (96%)",
          tag: "AI Pre-Scored",
          tagColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        },
        {
          title: "Campus Announcement — Midterm Review Schedule",
          meta: "Broadcasted to 142 students • 98% read rate",
          tag: "Broadcast",
          tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        },
      ],
    },
  },
  parent: {
    key: "parent",
    label: "Parents & Guardians",
    badge: "Verified Guardian Portal",
    title: "Transparent, real-time insight into your student's progress",
    subtitle:
      "Stay connected to your child's educational journey with verified attendance records, assignment milestones, and direct faculty communication channels.",
    icon: Users,
    highlights: [
      "Cryptographically verified parent-student pairing",
      "Daily attendance status and course participation metrics",
      "Longitudinal grade reports and teacher commentary",
      "Timely reminders for upcoming exams and major deliverables",
    ],
    mockup: {
      heading: "Guardian Overview Portal",
      subheading: "Linked Student: Maya Patel • Grade 11 Honors",
      metrics: [
        { label: "Term GPA", value: "3.94", detail: "Honors distinction" },
        { label: "Attendance Record", value: "98.4%", detail: "No unexcused absences" },
        { label: "Active Courses", value: "6 Tracked", detail: "All milestones current" },
      ],
      feedTitle: "Recent Student Academic Milestones",
      feedItems: [
        {
          title: "Physics Defense — Bohr Atomic Model",
          meta: "Completed today • Scored 96% in Socratic Study Pod",
          tag: "Mastery",
          tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        },
        {
          title: "Attendance Recorded — Present All Periods",
          meta: "Verified by Registrar at 08:30 AM",
          tag: "Present",
          tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        },
        {
          title: "Teacher Note from Dr. Harrison",
          meta: "Outstanding participation in advanced stoichiometry lab",
          tag: "Commendation",
          tagColor: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        },
      ],
    },
  },
  admin: {
    key: "admin",
    label: "Institutional Admin",
    badge: "Campus Governance & Security",
    title: "Campus-wide intelligence, compliance, and user lifecycle",
    subtitle:
      "Centralized governance across all academic departments, granular RBAC permission assignments, attendance auditing, and enterprise-grade telemetry.",
    icon: Shield,
    highlights: [
      "Complete user directory and enrollment lifecycle governance",
      "Campus-wide attendance telemetry and compliance logs",
      "Strict data isolation and zero student AI training retention",
      "Instant role assignment and password management controls",
    ],
    mockup: {
      heading: "Institutional Administration Terminal",
      subheading: "System Health: Optimal • Neon Serverless & Gemini Cluster Active",
      metrics: [
        { label: "Total Users", value: "1,480", detail: "Students, Faculty, Staff" },
        { label: "System Uptime", value: "99.98%", detail: "Zero degradation" },
        { label: "RBAC Compliance", value: "100%", detail: "SOC-2 audit aligned" },
      ],
      feedTitle: "Campus Governance & Telemetry Stream",
      feedItems: [
        {
          title: "Spring Term Enrollment Synchronization Complete",
          meta: "38 course sections updated • 1,480 student records verified",
          tag: "System",
          tagColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        },
        {
          title: "AWS S3 Presigned Upload Bucket Audit",
          meta: "420 GB active instructional files • Zero unauthorized access",
          tag: "Storage",
          tagColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        },
        {
          title: "Security & Encryption Protocol Check",
          meta: "TLS 1.3 enforced • bcrypt rounds validated • JWT secrets intact",
          tag: "Security",
          tagColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        },
      ],
    },
  },
};

export function RoleSwitcherPreview() {
  const [activeRole, setActiveRole] = useState<RoleKey>("student");
  const current = ROLES_DATA[activeRole];

  return (
    <div className="space-y-10">
      {/* Role Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {(Object.keys(ROLES_DATA) as RoleKey[]).map((key) => {
          const item = ROLES_DATA[key];
          const IconComp = item.icon;
          const isActive = activeRole === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveRole(key)}
              className={`group flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-1 ring-slate-800 dark:bg-white dark:text-slate-950 dark:ring-white/20"
                  : "border border-slate-200/80 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <IconComp className={`h-4 w-4 ${isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Feature Display Card */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-[#0A0F1D]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Description Column */}
          <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5 lg:border-r border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300">
                <Sparkles className="h-3 w-3" />
                <span>{current.badge}</span>
              </span>

              <h3 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                {current.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {current.subtitle}
              </p>

              {/* Highlight list */}
              <div className="mt-8 space-y-3">
                {current.highlights.map((hl) => (
                  <div key={hl} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/80">
              <a
                href="/register"
                className="group inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                <span>Launch {current.label} Workspace</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Right Live UI Mockup Column */}
          <div className="bg-slate-50/60 p-6 sm:p-8 lg:col-span-7 dark:bg-slate-900/40">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-base font-bold text-slate-950 dark:text-white">
                    {current.mockup.heading}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {current.mockup.subheading}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live View
                </span>
              </div>

              {/* Key Metrics */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                {current.mockup.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/50"
                  >
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                      {m.label}
                    </p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {m.value}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {m.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Activity / Feed */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  {current.mockup.feedTitle}
                </p>
                <div className="space-y-2.5">
                  {current.mockup.feedItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.meta}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}