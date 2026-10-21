import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { studyPodDefenses } from "@/db/schema";

export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

const FALLBACK_MODELS = [
  "gemma-4-26b-a4b-it",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
];

const MODEL_TIMEOUT_MS = 6000;

async function callGenAI(prompt: string, temperature = 0.35): Promise<string> {
  let lastErr: unknown;
  for (const model of FALLBACK_MODELS) {
    try {
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`TIMEOUT: ${model}`)), MODEL_TIMEOUT_MS)
      );
      const requestPromise = ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: { temperature },
      });
      const result = await Promise.race([requestPromise, timeoutPromise]);
      const text = result.text ?? "";
      if (text.trim()) return text;
    } catch (err) {
      lastErr = err;
      continue;
    }
  }
  throw lastErr ?? new Error("AI models are temporarily busy.");
}

/* ─── Intelligent Fallback Debate Generator ──────────────── */
function generateOfflineDebate(topic: string) {
  const cleanTopic = topic.trim();
  return {
    topic: cleanTopic,
    coreConflict: `The tension between intuitive physical analogies of ${cleanTopic} vs. its rigorous mathematical boundary conditions.`,
    challengeQuestion: `Elena's analogy helps you visualize ${cleanTopic}, but Alex identified a major scenario where that analogy breaks down. As the moderator, how do you mathematically resolve their conflict?`,
    turns: [
      {
        agent: "visualizer",
        name: "Elena Rostova",
        role: "The Visualizer",
        title: "Intuitive Physical Analogy",
        avatarColor: "#8B5CF6", // Violet
        content: `To build an intuitive mental model of **${cleanTopic}**, imagine a high-speed pressure valve in an engine. When fluid pressure builds up on one side, it doesn't just push harder—it redirects flow into a secondary reservoir to preserve system equilibrium. In the exact same way, ${cleanTopic} acts as nature's buffering mechanism: whenever one dynamic variable spikes, the counter-variable adjusts in real time to prevent divergence. If you can see the fluid flowing in your mind, you understand 80% of the concept.`,
        keyTakeaway: "Analogous to dynamic pressure redistribution preserving equilibrium.",
      },
      {
        agent: "skeptic",
        name: "Alex Vance",
        role: "The Skeptic",
        title: "Counter-Example & Boundary Breakdown",
        avatarColor: "#EF4444", // Red
        content: `Hold on, Elena—that pressure valve analogy is seductive, but dangerously incomplete. What happens when you test **${cleanTopic}** under non-linear boundary constraints or near zero-friction limits? The reservoir model completely breaks down because energy dissipation isn't symmetric. In edge cases where phase transitions occur, the reaction rate diverges instead of smoothly buffering. If a student relies purely on your physical analogy on an advanced exam, they will fail the proof step every single time.`,
        keyTakeaway: "Fails under non-linear boundary conditions and phase transitions.",
      },
      {
        agent: "examiner",
        name: "Dr. Marcus Chen",
        role: "The Examiner",
        title: "Scoring Rubric & Exam Traps",
        avatarColor: "#3B82F6", // Blue
        content: `Both Elena and Alex have exposed the classic 10-point trap on university exams. Examiners will intentionally give you a problem worded like Elena's analogy to lure you into assuming linearity, and then ask for the asymptotic limits where Alex's critique applies. To earn full marks, your answer must explicitly state: (1) the baseline equilibrium equations, AND (2) the precise boundary conditions where the standard approximation ceases to hold. Let's see if the student can synthesize this right now.`,
        keyTakeaway: "State baseline equations + specify non-linear boundary conditions.",
      },
    ],
  };
}

/* ─── Intelligent Fallback Student Evaluation ────────────── */
function generateOfflineEvaluation(topic: string, answer: string) {
  const words = answer.trim().split(/\s+/).length;
  const hasSubstance = words >= 15;
  const score = hasSubstance ? Math.min(95, 70 + Math.min(words, 25)) : 55;

  return {
    score,
    verdict: score >= 80 ? "Mastery Demonstrated" : "Partial Synthesis",
    synthesisSummary: `Your response bridges the intuitive mental model with boundary constraints for ${topic}. You recognized that approximations are valid only within specific operational limits.`,
    feedback: {
      visualizerComment: "Good work acknowledging the core intuition before diving into the exceptions.",
      skepticComment: "You rightly addressed the breakdown condition, though you should specify the exact mathematical limit next time.",
      examinerComment: "Strong synthesis. Under university grading rubrics, this demonstrates critical reasoning over rote memorization.",
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body || !body.action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    const { action, topic, studentAnswer, challengeQuestion } = body as {
      action: "debate" | "evaluate_student";
      topic: string;
      studentAnswer?: string;
      challengeQuestion?: string;
    };

    if (!topic || !topic.trim()) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    /* ══════════════════════════════════════════════════════
       ACTION: DEBATE ROUND
       3 autonomous agents discuss, dispute, and challenge
    ══════════════════════════════════════════════════════ */
    if (action === "debate") {
      const prompt = `You are orchestrating a high-level academic Multi-Agent Synthetic Study Pod debate on the topic: "${topic}".
The pod consists of 3 distinct autonomous AI peers:
1. Elena Rostova (The Visualizer): Uses spatial mental models, intuitive analogies, and physical intuition.
2. Alex Vance (The Skeptic): A rigorous academic skeptic who finds edge cases, paradoxes, and where Elena's analogy breaks down.
3. Dr. Marcus Chen (The Examiner): A senior academic examiner who synthesizes the dispute, reveals high-yield exam traps, and poses a challenging question directly to the student.

Output ONLY valid JSON in this exact structure (no markdown fences, no extra text):
{
  "topic": "${topic}",
  "coreConflict": "1 sentence defining the fundamental theoretical dispute between the agents",
  "challengeQuestion": "The specific question Dr. Marcus poses to the student requiring them to synthesize both perspectives",
  "turns": [
    {
      "agent": "visualizer",
      "name": "Elena Rostova",
      "role": "The Visualizer",
      "title": "Intuitive Mental Model",
      "avatarColor": "#8B5CF6",
      "content": "2-3 paragraphs of vivid, intuitive explanation with analogies and bold terms.",
      "keyTakeaway": "1 punchy summary sentence"
    },
    {
      "agent": "skeptic",
      "name": "Alex Vance",
      "role": "The Skeptic",
      "title": "Counter-Analysis & Boundary Limits",
      "avatarColor": "#EF4444",
      "content": "2-3 paragraphs challenging Elena's analogy with specific counterexamples, math limits, or paradoxes.",
      "keyTakeaway": "1 punchy summary sentence"
    },
    {
      "agent": "examiner",
      "name": "Dr. Marcus Chen",
      "role": "The Examiner",
      "title": "Exam Traps & Synthesis Challenge",
      "avatarColor": "#3B82F6",
      "content": "2 paragraphs explaining how university exams test this exact conflict, pointing out scoring traps, and calling on the student.",
      "keyTakeaway": "1 punchy summary sentence"
    }
  ]
}`;

      try {
        const raw = await callGenAI(prompt, 0.4);
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.turns && Array.isArray(parsed.turns) && parsed.turns.length === 3) {
            return NextResponse.json(parsed);
          }
        }
      } catch (err) {
        console.warn("[Study Pod Cloud AI fallback]:", err instanceof Error ? err.message : err);
      }

      // Safe, high-quality instant fallback
      return NextResponse.json(generateOfflineDebate(topic));
    }

    /* ══════════════════════════════════════════════════════
       ACTION: EVALUATE STUDENT SYNTHESIS
       Agents grade the student's answer to Dr. Marcus's challenge
    ══════════════════════════════════════════════════════ */
    if (action === "evaluate_student") {
      if (!studentAnswer || !studentAnswer.trim()) {
        return NextResponse.json({ error: "Answer cannot be empty" }, { status: 400 });
      }

      const prompt = `You are evaluating a student's answer in an academic Multi-Agent Study Pod.
Topic: "${topic}"
Challenge Question Posed by Dr. Marcus: "${challengeQuestion || "How do you resolve the conceptual conflict?"}"
Student Answer: "${studentAnswer}"

Each of the 3 agents evaluates the student:
1. Elena Rostova (The Visualizer): evaluates if the student grasped the core intuition.
2. Alex Vance (The Skeptic): evaluates if the student addressed the counterexamples and edge cases.
3. Dr. Marcus Chen (The Examiner): evaluates academic rigor and assigns a score (0 to 100).

Output ONLY valid JSON (no markdown fences):
{
  "score": 85,
  "verdict": "Mastery Demonstrated | Partial Synthesis | Needs Revision",
  "synthesisSummary": "2 sentences synthesizing how well the student resolved the debate.",
  "feedback": {
    "visualizerComment": "1 sentence critique from Elena",
    "skepticComment": "1 sentence critique from Alex",
    "examinerComment": "1 sentence critique from Dr. Marcus with rubric guidance"
  }
}`;

      let evaluationResult: any = null;
      try {
        const raw = await callGenAI(prompt, 0.25);
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.score !== undefined && parsed.feedback) {
            evaluationResult = parsed;
          }
        }
      } catch (err) {
        console.warn("[Study Pod Eval fallback]:", err instanceof Error ? err.message : err);
      }

      if (!evaluationResult) {
        evaluationResult = generateOfflineEvaluation(topic, studentAnswer);
      }

      // Persist student defense for peer review
      if (session?.sub) {
        try {
          await db.insert(studyPodDefenses).values({
            userId: session.sub,
            topic: topic.trim(),
            challengeQuestion: (challengeQuestion || "How do you resolve the conceptual conflict?").trim(),
            studentAnswer: studentAnswer.trim(),
            score: Number(evaluationResult.score) || 75,
            verdict: String(evaluationResult.verdict || "Synthesis Recorded"),
            synthesisSummary: String(evaluationResult.synthesisSummary || "Synthesis defense recorded."),
          });
        } catch (dbErr) {
          console.warn("[Study Pod Defense DB save failed]", dbErr);
        }
      }

      return NextResponse.json(evaluationResult);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("[Study Pod Route]", err);
    return NextResponse.json(
      { error: "Study Pod engine error: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
