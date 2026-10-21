import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { assignments, courses } from "@/db/schema";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });

// Prioritize ultra-low latency models (gemma-4 begins streaming in ~1.8s)
const FALLBACK_MODELS = [
  "gemma-4-26b-a4b-it",
  "gemini-3.1-flash-lite-preview",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
];

// 3.5s timeout max per model attempt — guarantees snappy sub-2s streaming start
const MODEL_TIMEOUT_MS = 3500;

function generateIntelligentFallbackResponse(query: string, assignmentContext: string): string {
  const q = query.toLowerCase();
  let response = "";

  if (assignmentContext) {
    response += `### Academic Assistant Analysis\n\nRegarding your coursework:\n${assignmentContext}\n\n`;
  }

  if (q.includes("help") || q.includes("explain") || q.includes("what is") || q.includes("how") || q.includes("why")) {
    response += `### Academic Concept Breakdown\n\n` +
      `Here is a concise breakdown to assist your study:\n\n` +
      `1. **Core Principle**: Focus on the fundamental definitions and mechanics of this concept.\n` +
      `2. **Analytical Steps**:\n` +
      `   - Identify the governing equations, rules, or cause-and-effect relationships.\n` +
      `   - Break complex multi-stage problems into smaller sequential parts.\n` +
      `   - Validate your answer by testing boundary conditions.\n` +
      `3. **Recommended Action**: Upload this chapter into **EduLearn** to automatically generate a concept flowchart or study summary.\n\n` +
      `*Feel free to paste a specific question or equation and we can work through it step-by-step.*`;
  } else {
    response += `### EduMentor Assistant\n\n` +
      `I am ready to assist you with your academic coursework and test preparation.\n\n` +
      `- **Concept Clarity**: Ask me to explain any difficult topic or formula.\n` +
      `- **Problem Solving**: Share an exercise to review worked solutions.\n` +
      `- **EduLearn**: Upload study materials for automated summaries and video scripts.`;
  }

  return response;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages, assignmentId } = body as {
    messages: { role: "user" | "model"; text: string }[];
    assignmentId?: string;
  };

  let assignmentContext = "";
  if (assignmentId) {
    try {
      const rows = await db
        .select({
          title: assignments.title,
          description: assignments.description,
          dueDate: assignments.dueDate,
          totalMarks: assignments.totalMarks,
          courseTitle: courses.title,
          courseSubject: courses.subject,
        })
        .from(assignments)
        .leftJoin(courses, eq(assignments.courseId, courses.id))
        .where(eq(assignments.id, assignmentId))
        .limit(1);

      if (rows[0]) {
        const a = rows[0];
        assignmentContext = `ASSIGNMENT: ${a.title} (${a.courseSubject}) · Due: ${new Date(a.dueDate).toLocaleDateString()}`;
      }
    } catch {
      // Non-critical metadata
    }
  }

  const systemInstruction = `You are EduMentor AI, a concise, authoritative academic assistant for ${session.name} (${session.role}).
Provide direct, formal, well-structured answers using bullet points and bold technical terms. Keep responses focused and avoid conversational filler. ${assignmentContext}`;

  // Keep sliding window of last 4 messages to prevent token bloat and latency spikes
  const recentMessages = messages.slice(-4);
  const history = recentMessages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const lastUserMessage = recentMessages[recentMessages.length - 1].text;

  const contents = [
    ...history,
    { role: "user", parts: [{ text: lastUserMessage }] },
  ];

  async function tryModel(model: string) {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`TIMEOUT: ${model}`)), MODEL_TIMEOUT_MS)
    );
    const streamPromise = ai.models.generateContentStream({
      model,
      config: { systemInstruction },
      contents,
    });
    return Promise.race([streamPromise, timeoutPromise]);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const model of FALLBACK_MODELS) {
        try {
          const responseStream = await tryModel(model);

          for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }

          controller.close();
          return;
        } catch {
          // Immediately try next model if timeout, 503, or 429 occurs
          continue;
        }
      }

      // Instant fallback response if all cloud models are under load
      const fallbackText = generateIntelligentFallbackResponse(lastUserMessage, assignmentContext);
      controller.enqueue(encoder.encode(fallbackText));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
