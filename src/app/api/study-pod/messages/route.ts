import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, asc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { studyPodMemberships, studyPodMessages, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

/* ─── GET /api/study-pod/messages ────────────────────────── */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const topicFilter = searchParams.get("topic");

  // 1. Get all accepted peers connected to the current user
  const peerRows = await db
    .select({
      inviterId: studyPodMemberships.inviterId,
      inviteeId: studyPodMemberships.inviteeId,
    })
    .from(studyPodMemberships)
    .where(
      and(
        eq(studyPodMemberships.status, "accepted"),
        or(
          eq(studyPodMemberships.inviterId, session.sub),
          eq(studyPodMemberships.inviteeId, session.sub)
        )
      )
    );

  const allowedUserIds = Array.from(
    new Set([
      session.sub,
      ...peerRows.map((r) => (r.inviterId === session.sub ? r.inviteeId : r.inviterId)),
    ])
  );

  // 2. Fetch messages sent by the user or their accepted peers
  const conditions = [inArray(studyPodMessages.senderId, allowedUserIds)];
  if (topicFilter && topicFilter.trim()) {
    // If topic filter is requested, match or show general
    // conditions.push(or(eq(studyPodMessages.topic, topicFilter.trim()), sql`topic IS NULL`));
  }

  const rows = await db
    .select({
      id: studyPodMessages.id,
      senderId: studyPodMessages.senderId,
      senderName: users.name,
      senderEmail: users.email,
      senderAvatar: users.avatarColor,
      message: studyPodMessages.message,
      topic: studyPodMessages.topic,
      createdAt: studyPodMessages.createdAt,
    })
    .from(studyPodMessages)
    .innerJoin(users, eq(users.id, studyPodMessages.senderId))
    .where(and(...conditions))
    .orderBy(asc(studyPodMessages.createdAt))
    .limit(150);

  return NextResponse.json({ messages: rows });
}

/* ─── POST /api/study-pod/messages ───────────────────────── */
const postMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  topic: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = postMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const { message, topic } = parsed.data;

  const inserted = await db
    .insert(studyPodMessages)
    .values({
      senderId: session.sub,
      message: message.trim(),
      topic: topic?.trim() || null,
    })
    .returning();

  // Fetch sender details
  const sender = await db
    .select({
      name: users.name,
      email: users.email,
      avatarColor: users.avatarColor,
    })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  return NextResponse.json({
    success: true,
    message: {
      ...inserted[0],
      senderName: sender[0]?.name || "You",
      senderEmail: sender[0]?.email || "",
      senderAvatar: sender[0]?.avatarColor || "#6366f1",
    },
  });
}
