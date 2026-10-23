"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: "AI Pedagogy",
    question: "How does the Multi-Agent Study Pod differ from generic chatbots like ChatGPT?",
    answer:
      "Unlike generic chatbots that simply provide direct answers or write essays for students, EduMentor AI enforces active cognitive defense. Three distinct personas—Elena (The Visualizer), Alex (The Skeptic), and Dr. Marcus (The Formal Examiner)—collaborate to challenge assumptions, highlight logical fallacies, and require students to synthesize their own understanding before issuing a formal rubric score (0–100%).",
  },
  {
    category: "Security & Privacy",
    question: "Does EduMentor AI train machine learning models on student responses or papers?",
    answer:
      "No. EduMentor AI enforces strict zero-retention policies on foundation model interactions. Student submissions, chat dialogues, and academic artifacts are never used to train public or private models. All storage is cryptographically isolated within your institutional database schema.",
  },
  {
    category: "Cloud Architecture",
    question: "How does the file storage system protect institutional documents?",
    answer:
      "All file transfers (syllabi, course materials, assignment submissions) bypass proxy servers using short-lived AWS S3 Presigned URLs. Files stream directly between the client browser and enterprise-grade S3 buckets with AES-256 encryption at rest, ensuring ultra-fast transfer speeds and zero proxy memory overhead.",
  },
  {
    category: "Academic Governance",
    question: "Can faculty members customize evaluation rubrics and weighted GPA metrics?",
    answer:
      "Yes. Faculty maintain complete control over curriculum parameters, rubric weighting, due dates, and grading criteria. AI defense scores serve as advisory recommendations and automated checkpoints that faculty can review, override, or approve with one click.",
  },
  {
    category: "Institutional RBAC",
    question: "How are student accounts linked to parents and guardians?",
    answer:
      "Parent accounts link to students through cryptographically verified guardian invitations created by administrators or authorized faculty. Once paired, parents receive real-time attendance telemetry, gradebook trajectory cards, and milestone alerts without exposing private peer discussions or unreleased examinations.",
  },
];

export function FAQAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  function toggle(idx: number) {
    setOpenIdx(openIdx === idx ? null : idx);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3.5">
      {FAQS.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-indigo-500/40 bg-white shadow-md dark:border-indigo-500/30 dark:bg-slate-900"
                : "border-slate-200/80 bg-white/60 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between p-5 sm:p-6 text-left transition"
            >
              <div className="pr-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  {faq.category}
                </span>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                  {faq.question}
                </h3>
              </div>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 transition-transform duration-200 dark:bg-slate-800 ${
                  isOpen ? "rotate-180 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400" : "text-slate-400"
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-6 pt-0 sm:px-6">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}