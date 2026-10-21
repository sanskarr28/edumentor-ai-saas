"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "model";
  text: string;
};

const SUGGESTIONS: Record<string, string[]> = {
  student: [
    "Explain this assignment to me",
    "How should I structure my answer?",
    "What study tips do you have?",
    "When is this assignment due?",
  ],
  teacher: [
    "How do I create an effective rubric?",
    "Tips for engaging students?",
    "How to write good assignment feedback?",
    "Summarize grading best practices",
  ],
  admin: [
    "How do I manage user accounts?",
    "Explain the reports dashboard",
    "How to add a new teacher?",
    "What do the AI insights show?",
  ],
  parent: [
    "How can I support my child's learning?",
    "What do the grades mean?",
    "How to check attendance?",
    "What is the AI insight feature?",
  ],
};

interface ChatBotProps {
  userRole: "admin" | "teacher" | "student" | "parent";
  userName: string;
}

export function ChatBot({ userRole, userName }: ChatBotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [assignmentId, setAssignmentId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Detect assignment context from URL (e.g. /dashboard/assignments)
  useEffect(() => {
    // If on assignments page, we'll let the user specify which assignment
    // The API picks it up via assignmentId param
    setAssignmentId(null);
  }, [pathname]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        setMessages([
          {
            id: "welcome",
            role: "model",
            text: `Hi ${userName.split(" ")[0]}! 👋 I'm your EduMentor AI Assistant. I can help you with assignments, explain concepts, and answer your academic questions. What would you like to know?`,
          },
        ]);
      }
    }
  }, [open, userName, messages.length]);

  async function sendMessage(text: string) {
    if (!text.trim() || streaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setStreaming(true);

    // Add placeholder for streaming response
    const modelMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: modelMsgId, role: "model", text: "" },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          assignmentId: assignmentId ?? undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "Unknown error");
        throw new Error(errText || "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // Flush any remaining bytes held by the decoder
          const remaining = decoder.decode();
          if (remaining) {
            accumulated += remaining;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === modelMsgId ? { ...m, text: accumulated } : m,
              ),
            );
          }
          break;
        }
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsgId ? { ...m, text: accumulated } : m,
          ),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === modelMsgId
            ? { ...m, text: `⚠️ ${msg}` }
            : m,
        ),
      );
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const suggestions = SUGGESTIONS[userRole] ?? [];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          open
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-indigo-600 hover:bg-indigo-500",
        )}
        aria-label="Open AI Assistant"
      >
        {open ? (
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">✨</span>
        )}
        {/* Unread indicator dot — shown when chat has never been opened */}
        {!open && messages.length === 0 && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full bg-rose-500 ring-2 ring-white" />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-indigo-600 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              ✨
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">EduMentor AI</p>
              <p className="text-xs text-indigo-200">
                {streaming ? "Typing..." : "Online · Ask me anything"}
              </p>
            </div>
            <button
              onClick={() => setMessages([])}
              title="Clear chat"
              className="rounded-lg p-1 text-indigo-200 hover:bg-white/10 hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex max-h-[360px] min-h-[200px] flex-col gap-3 overflow-y-auto p-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "rounded-br-sm bg-indigo-600 text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-800",
                  )}
                >
                  {m.text || (
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">●</span>
                      <span className="animate-bounce delay-100">●</span>
                      <span className="animate-bounce delay-200">●</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions — show only at start */}
          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 px-4 py-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2.5">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              disabled={streaming}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || streaming}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <p className="pb-2 text-center text-[10px] text-slate-400">
            Powered by Gemini · EduMentor AI
          </p>
        </div>
      )}
    </>
  );
}
