"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, ChevronRight, Award, Shield, FileText, ArrowRight, RefreshCw, Zap } from "lucide-react";

interface TopicDemo {
  id: string;
  badge: string;
  topic: string;
  elena: string;
  alex: string;
  defense: string;
  score: number;
  grade: string;
  status: string;
}

const DEMO_TOPICS: TopicDemo[] = [
  {
    id: "bohr",
    badge: "Quantum Physics",
    topic: "Bohr's Atomic Model & Quantized Angular Momentum",
    elena: "Think of the electron not as a particle circling a sun, but as a circular standing wave on a vibrating drum head. Only integer wavelengths fit without destructive cancellation!",
    alex: "If it's purely a stable standing wave, how does the model explain the fine-structure splitting observed in high-resolution spectroscopy when a magnetic field is applied?",
    defense: "Bohr quantized angular momentum as L = n*hbar. Fine structure required Sommerfeld's relativistic elliptical orbits and later Dirac's spin-orbit coupling, which Bohr's planar circular model omitted.",
    score: 96,
    grade: "Exemplary",
    status: "Verified by Dr. Marcus",
  },
  {
    id: "photosynthesis",
    badge: "Molecular Biology",
    topic: "Light-Dependent Reactions & Chemiosmotic ATP Synthesis",
    elena: "Picture the thylakoid lumen as a hydroelectric dam. Photons energize electrons down the cytochrome complex, pumping protons until ATP synthase spins like an electric turbine!",
    alex: "Why don't the reactive oxygen species produced during non-cyclic photophosphorylation permanently destroy the Photosystem II manganese cluster under excessive light intensity?",
    defense: "Non-photochemical quenching (NPQ) dissipates surplus excitation energy as heat via the xanthophyll cycle (violaxanthin to zeaxanthin), protecting the D1 protein from oxidative cleavage.",
    score: 94,
    grade: "Distinction",
    status: "Rubric Signed Off",
  },
  {
    id: "game-theory",
    badge: "Economics & Logic",
    topic: "The Nash Equilibrium in Repeated Cournot Duopolies",
    elena: "Imagine two rival coffee shops deciding daily prices. Neither can unilaterally discount without triggering a mutually destructive price war, finding an invisible balance.",
    alex: "Does this equilibrium hold when firms possess asymmetrical marginal cost structures and imperfect demand foresight over infinite repeated rounds?",
    defense: "In infinitely repeated games with discount factor delta >= 1 - (c1/c2), Grim Trigger or Tit-for-Tat strategies sustain collusive pricing as subgame-perfect Nash equilibria under the Folk Theorem.",
    score: 98,
    grade: "Mastery",
    status: "Peer Defense Complete",
  },
];

export function InteractiveHeroDemo() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const current = DEMO_TOPICS[selectedIdx];

  function handleSelect(idx: number) {
    if (idx === selectedIdx) return;
    setIsSynthesizing(true);
    setSelectedIdx(idx);
    setTimeout(() => setIsSynthesizing(false), 300);
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
      {/* Ambient decorative glow */}
      <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-indigo-500/25 via-blue-500/15 to-purple-500/20 blur-3xl dark:from-indigo-600/30 dark:via-blue-600/20 dark:to-purple-600/25" />

      {/* Main SaaS Showcase Window */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-indigo-950/15 backdrop-blur-xl dark:border-slate-800/90 dark:bg-[#0A0F1D]/95 dark:shadow-black/70">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-rose-500/80 ring-1 ring-rose-600/20" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80 ring-1 ring-amber-600/20" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80 ring-1 ring-emerald-600/20" />
            <span className="ml-3 font-mono text-[11px] text-slate-400 dark:text-slate-500">
              edumentor-ai://study-pod/live-defense
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              3 AI Agents Active
            </span>
          </div>
        </div>

        {/* Interactive Topic Selector Tabs */}
        <div className="border-b border-slate-100 bg-slate-50/40 p-3 sm:px-6 dark:border-slate-800 dark:bg-slate-900/30">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Select a live socratic defense scenario:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_TOPICS.map((topic, i) => (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleSelect(i)}
                className={`flex flex-col items-start rounded-xl px-3 py-2 text-left transition-all ${
                  selectedIdx === i
                    ? "border border-indigo-500/30 bg-white shadow-sm ring-1 ring-indigo-500/20 dark:border-indigo-500/40 dark:bg-slate-900 text-indigo-700 dark:text-indigo-300"
                    : "border border-transparent bg-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {topic.badge}
                </span>
                <span className="truncate text-xs font-semibold mt-0.5 max-w-[130px] sm:max-w-none">
                  {topic.topic.split("&")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Conversation Stream */}
        <div className={`p-5 sm:p-6 space-y-4 transition-opacity duration-200 ${isSynthesizing ? "opacity-40" : "opacity-100"}`}>
          {/* Active Topic Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {current.badge}
              </span>
              <h3 className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                {current.topic}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                Score: {current.score}/100
              </span>
              <p className="text-[10px] text-slate-400">{current.grade}</p>
            </div>
          </div>

          {/* Persona 1: Elena (Visualizer) */}
          <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
              E
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                  Elena (The Visualizer)
                </span>
                <span className="font-mono text-[10px] text-indigo-500 dark:text-indigo-400">
                  Intuitive Analogy
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                &quot;{current.elena}&quot;
              </p>
            </div>
          </div>

          {/* Persona 2: Alex (Skeptic) */}
          <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/40 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-white font-bold text-xs shadow-xs">
              A
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Alex (The Skeptic)
                </span>
                <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
                  Critical Challenge
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                &quot;{current.alex}&quot;
              </p>
            </div>
          </div>

          {/* Student Synthesis Defense */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-white p-3.5 shadow-xs dark:border-emerald-900/40 dark:bg-slate-900">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
              ✓
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Student Synthesis &amp; Defense
                </span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Evaluated at {current.score}%
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400 italic">
                &quot;{current.defense}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Live Bottom Action & Status Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/90 px-5 py-3.5 sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-white">{current.status}</span> • Transcript ready for faculty review
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400">
              <FileText className="h-3 w-3" />
              PDF Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}