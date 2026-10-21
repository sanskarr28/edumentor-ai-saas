"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Field, Input, Modal, Spinner, useToast } from "@/components/ui";
import { cn, initials, timeAgo } from "@/lib/utils";
import { useSession } from "@/components/session-provider";

/* ─── Vector SVG Icons ───────────────────────────────────── */
function IconPod({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconSparkles({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" />
    </svg>
  );
}

function IconDownload({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconRefresh({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function IconUserPlus({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

function IconUsers({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCheck({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconChat({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconSend({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ─── Types ─────────────────────────────────────────────── */
type AgentTurn = {
  agent: "visualizer" | "skeptic" | "examiner";
  name: string;
  role: string;
  title: string;
  avatarColor: string;
  content: string;
  keyTakeaway: string;
};

type DebateData = {
  topic: string;
  coreConflict: string;
  challengeQuestion: string;
  turns: AgentTurn[];
};

type EvaluationResult = {
  score: number;
  verdict: string;
  synthesisSummary: string;
  feedback: {
    visualizerComment: string;
    skepticComment: string;
    examinerComment: string;
  };
};

type PodMember = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  joinedAt: string;
  invitedByMe: boolean;
};

type ReceivedInvite = {
  inviteId: string;
  inviterId: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  createdAt: string;
};

type SentInvite = {
  inviteId: string;
  inviteeId: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  createdAt: string;
};

type PeerDefense = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  topic: string;
  challengeQuestion: string;
  studentAnswer: string;
  score: number;
  verdict: string;
  synthesisSummary: string;
  createdAt: string;
};

type ClassmateSuggestion = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

type PodChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderAvatar: string;
  message: string;
  topic?: string | null;
  createdAt: string;
};

const PRESETS = [
  "Bohr's Atomic Model vs Quantum Mechanics",
  "Heisenberg Uncertainty Principle",
  "CAP Theorem in Distributed Systems",
  "Keynesian Multiplier vs Inflation",
  "Photosynthesis Electron Transport Chain",
  "Quicksort vs Mergesort Worst-Case Limits",
];

export default function StudyPodPage() {
  const currentUser = useSession();
  const { push } = useToast();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [debate, setDebate] = useState<DebateData | null>(null);

  // Student answer state
  const [studentAnswer, setStudentAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  // Peer & Group Study Pod State
  const [members, setMembers] = useState<PodMember[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<ReceivedInvite[]>([]);
  const [sentInvites, setSentInvites] = useState<SentInvite[]>([]);
  const [peerDefenses, setPeerDefenses] = useState<PeerDefense[]>([]);
  const [loadingPeers, setLoadingPeers] = useState(true);

  // Invite Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [classmates, setClassmates] = useState<ClassmateSuggestion[]>([]);
  const [loadingClassmates, setLoadingClassmates] = useState(false);

  // Live Peer Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<PodChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function check() {
      setDarkMode(document.documentElement.classList.contains("dark"));
    }
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Load Study Pod Peers
  const loadPeers = useCallback(async () => {
    try {
      setLoadingPeers(true);
      const res = await fetch("/api/study-pod/peers");
      if (!res.ok) return;
      const data = await res.json();
      setMembers(data.members ?? []);
      setReceivedInvites(data.receivedInvites ?? []);
      setSentInvites(data.sentInvites ?? []);
      setPeerDefenses(data.peerDefenses ?? []);
    } catch {
      // ignore
    } finally {
      setLoadingPeers(false);
    }
  }, []);

  useEffect(() => {
    loadPeers();
  }, [loadPeers]);

  // Live Chat Fetch & Polling
  const loadChatMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/study-pod/messages");
      if (!res.ok) return;
      const data = await res.json();
      const incoming: PodChatMessage[] = data.messages ?? [];
      setChatMessages((prev) => {
        if (!chatOpen && incoming.length > prev.length) {
          const diff = incoming.length - prev.length;
          setUnreadChatCount((c) => c + diff);
        }
        return incoming;
      });
    } catch {
      // ignore
    }
  }, [chatOpen]);

  useEffect(() => {
    loadChatMessages();
    const interval = setInterval(loadChatMessages, 3500);
    return () => clearInterval(interval);
  }, [loadChatMessages]);

  useEffect(() => {
    if (chatOpen) {
      setUnreadChatCount(0);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chatOpen, chatMessages.length]);

  // Send a chat message
  async function handleSendMessage(customMsg?: string) {
    const text = (customMsg || chatInput).trim();
    if (!text) return;

    setSendingMessage(true);
    try {
      const res = await fetch("/api/study-pod/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          topic: debate?.topic || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setChatInput("");
      setChatMessages((prev) => [...prev, data.message]);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      push(err instanceof Error ? err.message : "Error sending message", "error");
    } finally {
      setSendingMessage(false);
    }
  }

  // Load Classmates Suggestions for Quick Inviting
  async function openInviteModal() {
    setInviteModalOpen(true);
    setInviteEmail("");
    if (classmates.length === 0) {
      try {
        setLoadingClassmates(true);
        const res = await fetch("/api/users?role=student");
        if (res.ok) {
          const data = await res.json();
          setClassmates(data.users ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoadingClassmates(false);
      }
    }
  }

  // Send an invite by email
  async function handleSendInvite(targetEmail?: string) {
    const emailToUse = (targetEmail || inviteEmail).trim();
    if (!emailToUse) {
      push("Please enter a valid registered email address", "error");
      return;
    }

    try {
      setSendingInvite(true);
      const res = await fetch("/api/study-pod/peers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send invitation");

      push(data.message || "Invitation sent successfully!", "success");
      setInviteEmail("");
      setInviteModalOpen(false);
      loadPeers();
    } catch (err) {
      push(err instanceof Error ? err.message : "Error sending invitation", "error");
    } finally {
      setSendingInvite(false);
    }
  }

  // Accept or Decline an incoming invitation
  async function handleRespondInvite(inviteId: string, action: "accept" | "reject") {
    try {
      const res = await fetch("/api/study-pod/peers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process invitation");

      if (action === "accept") {
        push(data.message || "You joined the Study Pod!", "success");
      } else {
        push("Invitation declined", "info");
      }
      loadPeers();
    } catch (err) {
      push(err instanceof Error ? err.message : "Error responding to invite", "error");
    }
  }

  // Remove peer or cancel sent invite
  async function handleRemovePeer(id: string, isInvite = false) {
    try {
      const res = await fetch(`/api/study-pod/peers?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      push(isInvite ? "Invitation cancelled" : "Peer removed from Study Pod", "info");
      loadPeers();
    } catch (err) {
      push(err instanceof Error ? err.message : "Error removing peer", "error");
    }
  }

  async function startDebate(selectedTopic?: string) {
    const t = (selectedTopic || topic).trim();
    if (!t) {
      push("Please enter a concept or select a preset", "error");
      return;
    }
    setLoading(true);
    setDebate(null);
    setEvaluation(null);
    setStudentAnswer("");

    try {
      const res = await fetch("/api/study-pod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "debate", topic: t }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Debate failed to initialize");
      setDebate(data);
      if (selectedTopic) setTopic(selectedTopic);
    } catch (err) {
      push(err instanceof Error ? err.message : "Error starting debate", "error");
    } finally {
      setLoading(false);
    }
  }

  async function submitStudentSynthesis() {
    if (!studentAnswer.trim()) {
      push("Please enter your synthesis answer", "error");
      return;
    }
    if (!debate) return;
    setEvaluating(true);

    try {
      const res = await fetch("/api/study-pod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_student",
          topic: debate.topic,
          challengeQuestion: debate.challengeQuestion,
          studentAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Evaluation failed");
      setEvaluation(data);
      loadPeers(); // Refresh peer defenses so your new defense shows up
    } catch (err) {
      push(err instanceof Error ? err.message : "Error evaluating answer", "error");
    } finally {
      setEvaluating(false);
    }
  }

  async function downloadDebatePdf() {
    if (!debate) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`AI Study Pod Debate: ${debate.topic}`, 15, 20);
      let y = 30;

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Core Theoretical Conflict: ${debate.coreConflict}`, 15, y);
      y += 12;

      for (const turn of debate.turns) {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`${turn.name} (${turn.role}) — ${turn.title}`, 15, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        const lines = doc.splitTextToSize(turn.content.replace(/\*\*/g, ""), 180);
        for (const l of lines) {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.text(l, 15, y);
          y += 5;
        }
        y += 6;
      }

      if (evaluation) {
        if (y > 220) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Student Synthesis Score: ${evaluation.score}/100 (${evaluation.verdict})`, 15, y);
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text("Student Defense:", 15, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const ansLines = doc.splitTextToSize(studentAnswer, 180);
        for (const l of ansLines) {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(l, 15, y);
          y += 5;
        }
        y += 4;
        doc.setFont("helvetica", "bold");
        doc.text("Evaluation Summary:", 15, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        const sumLines = doc.splitTextToSize(evaluation.synthesisSummary, 180);
        for (const l of sumLines) {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.text(l, 15, y);
          y += 5;
        }
      }

      doc.save(`Study-Pod-${debate.topic.replace(/\s+/g, "_")}.pdf`);
    } catch {
      push("Export failed", "error");
    }
  }

  return (
    <div className="space-y-6 relative">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">
              Synthetic Peer Room & Study Group
            </p>
          </div>
          <h1 className={cn("mt-1 text-xl font-bold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
            Multi-Agent Study Pod
          </h1>
          <p className={cn("mt-0.5 text-xs", darkMode ? "text-slate-400" : "text-slate-500")}>
            Engage in Socratic debate with autonomous AI personas and collaborate with accepted study friends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Peer Chat Toggle Button */}
          <Button
            size="sm"
            variant={chatOpen ? "primary" : "outline"}
            onClick={() => setChatOpen(!chatOpen)}
            className="relative"
          >
            <span className="flex items-center gap-1.5">
              <IconChat />
              <span>Peer Chat</span>
              {unreadChatCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white animate-bounce">
                  {unreadChatCount}
                </span>
              )}
            </span>
          </Button>

          <Button size="sm" variant="outline" onClick={openInviteModal}>
            <span className="flex items-center gap-1.5">
              <IconUserPlus />
              <span>Invite Friend</span>
            </span>
          </Button>

          {debate && (
            <>
              <Button size="sm" variant="outline" onClick={downloadDebatePdf}>
                <span className="flex items-center gap-1.5">
                  <IconDownload />
                  <span>Export Briefing PDF</span>
                </span>
              </Button>
              <button
                onClick={() => {
                  setDebate(null);
                  setEvaluation(null);
                  setStudentAnswer("");
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-sm",
                  darkMode
                    ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                )}
              >
                <IconRefresh />
                <span>New Topic</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Incoming Pending Invitations Banner ── */}
      {receivedInvites.length > 0 && (
        <div className="space-y-2">
          {receivedInvites.map((inv) => (
            <div
              key={inv.inviteId}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 shadow-sm transition",
                darkMode
                  ? "border-indigo-900/60 bg-indigo-950/30 text-slate-100"
                  : "border-indigo-200 bg-indigo-50/70 text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-semibold text-xs shrink-0 shadow-sm"
                  style={{ backgroundColor: inv.avatarColor || "#6366f1" }}
                >
                  {initials(inv.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Study Pod Invitation
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {timeAgo(inv.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-0.5">
                    {inv.name} <span className="text-xs font-normal text-slate-500">({inv.email})</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Invited you to collaborate and debate academic concepts together in their Study Pod.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => handleRespondInvite(inv.inviteId, "accept")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <span className="flex items-center gap-1.5">
                    <IconCheck />
                    <span>Accept & Join Pod</span>
                  </span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRespondInvite(inv.inviteId, "reject")}
                >
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <IconX />
                    <span>Decline</span>
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Active Pod Members Roster Bar ── */}
      <div
        className={cn(
          "rounded-xl border p-4.5 transition-colors shadow-sm space-y-3",
          darkMode ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-white"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <IconUsers className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={cn("text-xs font-bold uppercase tracking-wider", darkMode ? "text-slate-200" : "text-slate-800")}>
                  Study Pod Peers
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                  {members.length} {members.length === 1 ? "Friend" : "Friends"} Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Friends who accept your invite can participate in shared Socratic pods, compare synthesis scores, and chat live.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setChatOpen(true)}
              className="text-xs"
            >
              <span className="flex items-center gap-1.5">
                <IconChat className="h-3.5 w-3.5 text-blue-500" />
                <span>Open Peer Chat</span>
              </span>
            </Button>
            <button
              onClick={openInviteModal}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs font-medium transition",
                darkMode
                  ? "border-slate-700 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                  : "border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600"
              )}
            >
              <IconUserPlus className="h-3.5 w-3.5" />
              <span>+ Add Friend by Email</span>
            </button>
          </div>
        </div>

        {/* Members List */}
        {loadingPeers ? (
          <div className="flex items-center gap-2 py-3 text-xs text-slate-400">
            <Spinner className="h-3.5 w-3.5" />
            <span>Loading Study Pod members...</span>
          </div>
        ) : members.length === 0 && sentInvites.length === 0 ? (
          <div className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-500">
            <span>No friends added yet. Enter a registered student email to study and chat together!</span>
            <button onClick={openInviteModal} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              Send Invite →
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {/* Accepted Members */}
            {members.map((m) => (
              <div
                key={m.membershipId}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs transition",
                  darkMode
                    ? "border-slate-800 bg-slate-950/60 text-slate-200"
                    : "border-slate-200 bg-slate-50/80 text-slate-800"
                )}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: m.avatarColor || "#6366f1" }}
                >
                  {initials(m.name)}
                </div>
                <div>
                  <p className="font-semibold leading-none">{m.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{m.email}</p>
                </div>
                <span className="flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active Peer
                </span>
                <button
                  onClick={() => handleRemovePeer(m.membershipId)}
                  title="Remove from Pod"
                  className="ml-1 text-slate-400 hover:text-rose-500 transition"
                >
                  <IconX className="h-3 w-3" />
                </button>
              </div>
            ))}

            {/* Pending Sent Invites */}
            {sentInvites.map((inv) => (
              <div
                key={inv.inviteId}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border border-dashed px-3 py-2 text-xs transition opacity-80",
                  darkMode
                    ? "border-slate-700 bg-slate-950/30 text-slate-300"
                    : "border-slate-300 bg-slate-50/50 text-slate-600"
                )}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: inv.avatarColor || "#94a3b8" }}
                >
                  {initials(inv.name)}
                </div>
                <div>
                  <p className="font-semibold leading-none">{inv.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{inv.email}</p>
                </div>
                <span className="rounded bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40">
                  Invite Sent
                </span>
                <button
                  onClick={() => handleRemovePeer(inv.inviteId, true)}
                  title="Cancel Invitation"
                  className="ml-1 text-slate-400 hover:text-rose-500 transition text-[11px]"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Persona Roster Deck ── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {/* Persona 1: Visualizer */}
        <div
          className={cn(
            "rounded-xl border p-4.5 transition-colors shadow-sm",
            darkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold text-xs font-mono">
                ER
              </span>
              <div>
                <p className={cn("text-xs font-semibold", darkMode ? "text-slate-100" : "text-slate-900")}>
                  Elena Rostova
                </p>
                <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400">The Visualizer</p>
              </div>
            </div>
            <span className="rounded border border-purple-200 dark:border-purple-900/60 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 text-[10px] font-mono text-purple-700 dark:text-purple-300">
              Intuition
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Translates abstract formulas into physical intuition, mechanical analogies, and spatial mental models.
          </p>
        </div>

        {/* Persona 2: Skeptic */}
        <div
          className={cn(
            "rounded-xl border p-4.5 transition-colors shadow-sm",
            darkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold text-xs font-mono">
                AV
              </span>
              <div>
                <p className={cn("text-xs font-semibold", darkMode ? "text-slate-100" : "text-slate-900")}>
                  Alex Vance
                </p>
                <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">The Skeptic</p>
              </div>
            </div>
            <span className="rounded border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 text-[10px] font-mono text-rose-700 dark:text-rose-300">
              Edge Cases
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Tests boundary conditions, exposes where common analogies break down, and challenges unstated assumptions.
          </p>
        </div>

        {/* Persona 3: Examiner */}
        <div
          className={cn(
            "rounded-xl border p-4.5 transition-colors shadow-sm",
            darkMode ? "border-slate-800 bg-slate-900/70" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-xs font-mono">
                MC
              </span>
              <div>
                <p className={cn("text-xs font-semibold", darkMode ? "text-slate-100" : "text-slate-900")}>
                  Dr. Marcus Chen
                </p>
                <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">The Examiner</p>
              </div>
            </div>
            <span className="rounded border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 text-[10px] font-mono text-blue-700 dark:text-blue-300">
              Exam Rigor
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Focuses on university exam scoring rubrics, high-yield traps, proof steps, and Socratic evaluation.
          </p>
        </div>
      </div>

      {/* ── Topic Input & Quick Presets ── */}
      {!debate && (
        <div
          className={cn(
            "rounded-xl border p-6 transition-colors shadow-sm space-y-4",
            darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <label className={cn("block text-xs font-semibold uppercase tracking-wider", darkMode ? "text-slate-300" : "text-slate-700")}>
                What topic should the Study Pod debate?
              </label>
              <p className="mt-0.5 text-xs text-slate-500">
                Enter any theorem, atomic model, algorithm, or academic controversy.
              </p>
            </div>
            {members.length > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Co-op Pod Active ({members.length} peers connected)
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Bohr's Atomic Model vs Quantum Mechanics, Heisenberg Uncertainty, CAP Theorem..."
              className={cn(
                "flex-1 rounded-lg border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition",
                darkMode
                  ? "border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600"
                  : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  startDebate();
                }
              }}
            />
            <Button onClick={() => startDebate()} loading={loading} disabled={!topic.trim() || loading}>
              <span className="flex items-center gap-1.5">
                <IconSparkles />
                <span>Commence Debate</span>
              </span>
            </Button>
          </div>

          <div>
            <p className="text-[11px] font-medium text-slate-400 mb-2">Or select a high-yield concept:</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => startDebate(p)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition",
                    darkMode
                      ? "border-slate-800 bg-slate-850 text-slate-300 hover:border-slate-700 hover:text-white"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Active Debate View ── */}
      {debate && (
        <div className="space-y-5">
          {/* Core Theoretical Conflict Banner */}
          <div
            className={cn(
              "rounded-xl border p-4.5 transition-colors shadow-sm",
              darkMode ? "border-slate-800 bg-slate-900/90" : "border-slate-200 bg-white"
            )}
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              <IconPod />
              <span>Core Theoretical Conflict</span>
            </div>
            <p className={cn("mt-1.5 text-sm font-semibold leading-snug", darkMode ? "text-slate-100" : "text-slate-900")}>
              {debate.coreConflict}
            </p>
          </div>

          {/* Socratic Debate Feed */}
          <div className="space-y-3.5">
            {debate.turns.map((turn, idx) => (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border p-5 transition-colors shadow-sm relative overflow-hidden",
                  darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
                )}
              >
                {/* Agent Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-white font-mono font-bold text-xs"
                      style={{ backgroundColor: turn.avatarColor }}
                    >
                      {initials(turn.name)}
                    </span>
                    <div>
                      <p className={cn("text-xs font-semibold", darkMode ? "text-slate-100" : "text-slate-900")}>
                        {turn.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{turn.role}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {turn.title}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-3.5 text-xs leading-relaxed text-slate-700 dark:text-slate-300 space-y-2">
                  {turn.content.split("\n\n").map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split(/(\*\*.*?\*\*)/g).map((part, partIdx) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return (
                            <strong key={partIdx} className="font-semibold text-slate-900 dark:text-white">
                              {part.slice(2, -2)}
                            </strong>
                          );
                        }
                        return part;
                      })}
                    </p>
                  ))}
                </div>

                {/* Key Takeaway Badge */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Takeaway:</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    {turn.keyTakeaway}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Student Synthesis Defense Sandbox ── */}
          <div
            className={cn(
              "rounded-xl border p-6 transition-colors shadow-sm space-y-4",
              darkMode ? "border-blue-900/40 bg-blue-950/20" : "border-blue-200 bg-blue-50/40"
            )}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                <span>Your Turn: Student Synthesis Challenge</span>
              </div>
              <p className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                {debate.challengeQuestion}
              </p>
              <p className="text-xs text-slate-500">
                Synthesize Elena's intuition with Alex's edge case critiques. Dr. Marcus will evaluate your response based on academic scoring rubrics.
              </p>
            </div>

            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="State how you reconcile the physical analogy with the boundary condition. Be specific about the governing rules or limits..."
              rows={4}
              className={cn(
                "w-full rounded-lg border p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition leading-relaxed",
                darkMode
                  ? "border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-600"
                  : "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400"
              )}
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Aim for depth: address both intuition and boundary conditions.
              </span>
              <Button onClick={submitStudentSynthesis} loading={evaluating} disabled={!studentAnswer.trim() || evaluating}>
                Submit Synthesis Defense
              </Button>
            </div>
          </div>

          {/* ── Evaluation Results Card ── */}
          {evaluation && (
            <div
              className={cn(
                "rounded-xl border p-6 transition-colors shadow-sm space-y-5 animate-in fade-in duration-300",
                darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl font-bold font-mono text-base",
                      evaluation.score >= 80
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                        : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                    )}
                  >
                    {evaluation.score}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm font-semibold tracking-tight", darkMode ? "text-slate-100" : "text-slate-900")}>
                        Synthesis Defense Evaluation
                      </p>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          evaluation.score >= 80
                            ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        )}
                      >
                        {evaluation.verdict}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {evaluation.synthesisSummary}
                    </p>
                  </div>
                </div>

                <Button size="sm" onClick={downloadDebatePdf}>
                  <span className="flex items-center gap-1.5">
                    <IconDownload />
                    <span>Save Scorecard PDF</span>
                  </span>
                </Button>
              </div>

              {/* Persona Feedback Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className={cn("rounded-lg border p-3.5 space-y-1.5", darkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/50")}>
                  <p className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">Elena (Intuition)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evaluation.feedback.visualizerComment}
                  </p>
                </div>

                <div className={cn("rounded-lg border p-3.5 space-y-1.5", darkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/50")}>
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Alex (Critique & Limits)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evaluation.feedback.skepticComment}
                  </p>
                </div>

                <div className={cn("rounded-lg border p-3.5 space-y-1.5", darkMode ? "border-slate-800 bg-slate-950/50" : "border-slate-100 bg-slate-50/50")}>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">Dr. Marcus (Exam Rubric)</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {evaluation.feedback.examinerComment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Peer Activity & Collaborative Defenses Feed ── */}
      {peerDefenses.length > 0 && (
        <div
          className={cn(
            "rounded-xl border p-5 transition-colors shadow-sm space-y-4",
            darkMode ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <IconSparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <h3 className={cn("text-xs font-bold uppercase tracking-wider", darkMode ? "text-slate-200" : "text-slate-800")}>
                  Peer Socratic Leaderboard & Defenses
                </h3>
                <p className="text-[11px] text-slate-500">
                  Recent solutions and defense scores achieved by your Study Pod friends.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {peerDefenses.length} submissions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {peerDefenses.map((pd) => (
              <div
                key={pd.id}
                className={cn(
                  "rounded-lg border p-3.5 space-y-2.5 transition",
                  darkMode ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: pd.userAvatar || "#6366f1" }}
                    >
                      {initials(pd.userName)}
                    </div>
                    <span className="text-xs font-semibold">{pd.userName}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold font-mono",
                        pd.score >= 80
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                      )}
                    >
                      {pd.score}%
                    </span>
                    <span className="text-[10px] text-slate-400">{timeAgo(pd.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                    Topic: {pd.topic}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 mt-0.5">
                    "{pd.studentAnswer}"
                  </p>
                </div>

                <div className="rounded bg-slate-100 dark:bg-slate-900 px-2 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dr. Marcus: </span>
                  {pd.synthesisSummary}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Invite Friend Modal ── */}
      <Modal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title="Invite Friend to Study Pod">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter the registered email of your friend. They will receive an in-app notification to <strong>Accept</strong> or <strong>Decline</strong>. Once accepted, you can debate and chat together!
          </p>

          <Field label="Friend's Registered Email Address">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="e.g. maya.patel@edumentor.ai"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendInvite();
                  }
                }}
              />
              <Button onClick={() => handleSendInvite()} loading={sendingInvite} disabled={!inviteEmail.trim() || sendingInvite}>
                Invite
              </Button>
            </div>
          </Field>

          {/* Quick Select Classmates */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Registered Classmates:
            </p>

            {loadingClassmates ? (
              <div className="flex items-center gap-2 py-2 text-xs text-slate-400">
                <Spinner className="h-3.5 w-3.5" />
                <span>Loading registered classmates...</span>
              </div>
            ) : classmates.length === 0 ? (
              <p className="text-xs text-slate-400">No other students found.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {classmates.map((c) => {
                  const isAlreadyMember = members.some((m) => m.userId === c.id);
                  const isPending = sentInvites.some((s) => s.inviteeId === c.id);

                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800/80 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: c.avatarColor || "#6366f1" }}
                        >
                          {initials(c.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{c.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{c.email}</p>
                        </div>
                      </div>

                      {isAlreadyMember ? (
                        <span className="rounded bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Connected
                        </span>
                      ) : isPending ? (
                        <span className="rounded bg-amber-50 dark:bg-amber-950 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          Invited
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendInvite(c.email)}
                          disabled={sendingInvite}
                          className="text-[11px] px-2.5 py-1"
                        >
                          Invite
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Fixed / Docked Peer Live Chat Window ── */}
      {chatOpen && (
        <div
          className={cn(
            "fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border shadow-2xl transition-all duration-300 flex flex-col",
            darkMode
              ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/80"
              : "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
          )}
          style={{ height: "520px" }}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/80 dark:bg-slate-950/50 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>Study Pod Live Chat</span>
                  <span className="rounded bg-blue-100 dark:bg-blue-950 px-1.5 py-0.2 text-[9px] font-mono text-blue-700 dark:text-blue-300">
                    {members.length + 1} online
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                  {members.length > 0
                    ? `With ${members.map((m) => m.name.split(" ")[0]).join(", ")}`
                    : "Invite friends to chat live"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setChatOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Minimize Chat"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Discussion Prompts */}
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 flex gap-1.5 overflow-x-auto text-[10px] whitespace-nowrap bg-slate-50/40 dark:bg-slate-950/30">
            <button
              onClick={() => handleSendMessage("What did you write for Dr. Marcus's challenge?")}
              className="rounded-full border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition"
            >
              Ask about Dr. Marcus 💡
            </button>
            <button
              onClick={() => handleSendMessage("Did you see the edge case Alex pointed out?")}
              className="rounded-full border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-slate-500 hover:border-blue-500 hover:text-blue-500 transition"
            >
              Discuss Alex's critique ⚡
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 px-4">
                <span className="text-2xl mb-1">💬</span>
                <p className="font-semibold text-xs">No messages yet in this Pod</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Start the discussion! Ask your peers how they resolved the Socratic debate.
                </p>
              </div>
            ) : (
              chatMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2 max-w-[85%]",
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {!isMe && (
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white shrink-0 mt-0.5"
                        style={{ backgroundColor: msg.senderAvatar || "#6366f1" }}
                      >
                        {initials(msg.senderName)}
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <div className={cn("flex items-center gap-1.5 text-[10px]", isMe ? "justify-end" : "justify-start")}>
                        <span className="font-semibold text-slate-600 dark:text-slate-400">
                          {isMe ? "You" : msg.senderName}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {timeAgo(msg.createdAt)}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "rounded-2xl px-3.5 py-2 leading-relaxed shadow-sm break-words",
                          isMe
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : darkMode
                            ? "bg-slate-800 text-slate-100 rounded-tl-sm border border-slate-700/60"
                            : "bg-slate-100 text-slate-900 rounded-tl-sm border border-slate-200/80"
                        )}
                      >
                        {msg.message}
                      </div>

                      {msg.topic && (
                        <p className={cn("text-[9px] text-slate-400 flex items-center gap-1", isMe ? "justify-end" : "justify-start")}>
                          <span>🔖 {msg.topic}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 rounded-b-2xl">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message your Study Pod peers..."
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 transition",
                  darkMode
                    ? "border-slate-800 bg-slate-900 text-slate-100 placeholder-slate-500"
                    : "border-slate-300 bg-white text-slate-900 placeholder-slate-400"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => handleSendMessage()}
                disabled={!chatInput.trim() || sendingMessage}
                loading={sendingMessage}
                className="rounded-xl px-3"
              >
                <IconSend className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
