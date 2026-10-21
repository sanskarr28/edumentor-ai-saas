import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { db } from "@/db";
import { notifications, studyPodDefenses, studyPodMemberships, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

/* ─── GET /api/study-pod/peers ───────────────────────────── */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. Fetch all memberships involving the current user
  const memberships = await db
    .select({
      id: studyPodMemberships.id,
      inviterId: studyPodMemberships.inviterId,
      inviteeId: studyPodMemberships.inviteeId,
      status: studyPodMemberships.status,
      createdAt: studyPodMemberships.createdAt,
      updatedAt: studyPodMemberships.updatedAt,
    })
    .from(studyPodMemberships)
    .where(
      or(
        eq(studyPodMemberships.inviterId, session.sub),
        eq(studyPodMemberships.inviteeId, session.sub)
      )
    )
    .orderBy(desc(studyPodMemberships.updatedAt));

  // Collect other user IDs
  const otherUserIds = Array.from(
    new Set(
      memberships.map((m) => (m.inviterId === session.sub ? m.inviteeId : m.inviterId))
    )
  );

  let userMap = new Map<string, { id: string; name: string; email: string; role: string; avatarColor: string }>();

  if (otherUserIds.length > 0) {
    const fetchedUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        avatarColor: users.avatarColor,
      })
      .from(users)
      .where(inArray(users.id, otherUserIds));

    for (const u of fetchedUsers) {
      userMap.set(u.id, u);
    }
  }

  // Group memberships
  const members: Array<{
    membershipId: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    avatarColor: string;
    joinedAt: Date;
    invitedByMe: boolean;
  }> = [];

  const receivedInvites: Array<{
    inviteId: string;
    inviterId: string;
    name: string;
    email: string;
    role: string;
    avatarColor: string;
    createdAt: Date;
  }> = [];

  const sentInvites: Array<{
    inviteId: string;
    inviteeId: string;
    name: string;
    email: string;
    role: string;
    avatarColor: string;
    createdAt: Date;
  }> = [];

  for (const m of memberships) {
    const isInviter = m.inviterId === session.sub;
    const otherId = isInviter ? m.inviteeId : m.inviterId;
    const otherUser = userMap.get(otherId);
    if (!otherUser) continue;

    if (m.status === "accepted") {
      members.push({
        membershipId: m.id,
        userId: otherUser.id,
        name: otherUser.name,
        email: otherUser.email,
        role: otherUser.role,
        avatarColor: otherUser.avatarColor,
        joinedAt: m.updatedAt || m.createdAt,
        invitedByMe: isInviter,
      });
    } else if (m.status === "pending") {
      if (isInviter) {
        sentInvites.push({
          inviteId: m.id,
          inviteeId: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          role: otherUser.role,
          avatarColor: otherUser.avatarColor,
          createdAt: m.createdAt,
        });
      } else {
        receivedInvites.push({
          inviteId: m.id,
          inviterId: otherUser.id,
          name: otherUser.name,
          email: otherUser.email,
          role: otherUser.role,
          avatarColor: otherUser.avatarColor,
          createdAt: m.createdAt,
        });
      }
    }
  }

  // 2. Fetch peer defenses if we have active members
  const memberUserIds = members.map((m) => m.userId);
  let peerDefenses: Array<{
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
    createdAt: Date;
  }> = [];

  if (memberUserIds.length > 0) {
    const rawPeerDefenses = await db
      .select({
        id: studyPodDefenses.id,
        userId: studyPodDefenses.userId,
        userName: users.name,
        userAvatar: users.avatarColor,
        topic: studyPodDefenses.topic,
        challengeQuestion: studyPodDefenses.challengeQuestion,
        studentAnswer: studyPodDefenses.studentAnswer,
        score: studyPodDefenses.score,
        verdict: studyPodDefenses.verdict,
        synthesisSummary: studyPodDefenses.synthesisSummary,
        createdAt: studyPodDefenses.createdAt,
      })
      .from(studyPodDefenses)
      .innerJoin(users, eq(users.id, studyPodDefenses.userId))
      .where(inArray(studyPodDefenses.userId, memberUserIds))
      .orderBy(desc(studyPodDefenses.createdAt))
      .limit(12);

    peerDefenses = rawPeerDefenses;
  }

  // 3. Fetch user's own recent defenses
  const myDefenses = await db
    .select({
      id: studyPodDefenses.id,
      userId: studyPodDefenses.userId,
      topic: studyPodDefenses.topic,
      challengeQuestion: studyPodDefenses.challengeQuestion,
      studentAnswer: studyPodDefenses.studentAnswer,
      score: studyPodDefenses.score,
      verdict: studyPodDefenses.verdict,
      synthesisSummary: studyPodDefenses.synthesisSummary,
      createdAt: studyPodDefenses.createdAt,
    })
    .from(studyPodDefenses)
    .where(eq(studyPodDefenses.userId, session.sub))
    .orderBy(desc(studyPodDefenses.createdAt))
    .limit(10);

  return NextResponse.json({
    members,
    receivedInvites,
    sentInvites,
    peerDefenses,
    myDefenses,
  });
}

/* ─── POST /api/study-pod/peers (Send Invitation by Email) ── */
const inviteSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const cleanEmail = parsed.data.email.trim().toLowerCase();

  // 1. Look up user by email
  const targetUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, cleanEmail))
    .limit(1);

  const target = targetUsers[0];
  if (!target) {
    return NextResponse.json(
      { error: `No registered user found with email "${cleanEmail}". Make sure they have an active EduMentor account.` },
      { status: 404 }
    );
  }

  if (target.id === session.sub) {
    return NextResponse.json(
      { error: "You cannot invite yourself to your Study Pod." },
      { status: 400 }
    );
  }

  // 2. Check existing relationship
  const existing = await db
    .select()
    .from(studyPodMemberships)
    .where(
      or(
        and(
          eq(studyPodMemberships.inviterId, session.sub),
          eq(studyPodMemberships.inviteeId, target.id)
        ),
        and(
          eq(studyPodMemberships.inviterId, target.id),
          eq(studyPodMemberships.inviteeId, session.sub)
        )
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const rel = existing[0];
    if (rel.status === "accepted") {
      return NextResponse.json(
        { error: `${target.name} is already a member of your Study Pod.` },
        { status: 400 }
      );
    }
    if (rel.status === "pending") {
      if (rel.inviterId === session.sub) {
        return NextResponse.json(
          { error: `An invitation to ${target.name} is already pending.` },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: `${target.name} has already sent you an invitation! Check your incoming invitations above.` },
          { status: 400 }
        );
      }
    }

    // If previously rejected, re-activate as pending
    await db
      .update(studyPodMemberships)
      .set({
        inviterId: session.sub,
        inviteeId: target.id,
        status: "pending",
        updatedAt: new Date(),
      })
      .where(eq(studyPodMemberships.id, rel.id));
  } else {
    // Insert new pending invite
    await db.insert(studyPodMemberships).values({
      inviterId: session.sub,
      inviteeId: target.id,
      status: "pending",
    });
  }

  // 3. Fetch inviter profile to build personalized notification
  const inviterProfile = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, session.sub))
    .limit(1);

  const inviterName = inviterProfile[0]?.name || "A classmate";

  // 4. Send in-app notification to the invited friend
  await db.insert(notifications).values({
    userId: target.id,
    title: "Study Pod Invitation",
    message: `${inviterName} invited you to join their AI Study Pod! Accept to debate and practice concepts together.`,
    type: "study_pod_invite",
    link: "/dashboard/study-pod",
  });

  return NextResponse.json({
    success: true,
    message: `Invitation successfully sent to ${target.name} (${target.email}).`,
    invitee: {
      id: target.id,
      name: target.name,
      email: target.email,
    },
  });
}

/* ─── PATCH /api/study-pod/peers (Accept or Reject Invitation) ── */
const respondSchema = z.object({
  inviteId: z.string().uuid(),
  action: z.enum(["accept", "reject"]),
});

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invitation response payload." }, { status: 400 });
  }

  const { inviteId, action } = parsed.data;

  // Look up pending invite where caller is invitee
  const invites = await db
    .select()
    .from(studyPodMemberships)
    .where(
      and(
        eq(studyPodMemberships.id, inviteId),
        eq(studyPodMemberships.inviteeId, session.sub),
        eq(studyPodMemberships.status, "pending")
      )
    )
    .limit(1);

  const invite = invites[0];
  if (!invite) {
    return NextResponse.json(
      { error: "Invitation not found or has already been responded to." },
      { status: 404 }
    );
  }

  const now = new Date();

  if (action === "accept") {
    await db
      .update(studyPodMemberships)
      .set({
        status: "accepted",
        updatedAt: now,
      })
      .where(eq(studyPodMemberships.id, inviteId));

    // Get current user's name to notify inviter
    const me = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, session.sub))
      .limit(1);

    const responderName = me[0]?.name || "Your friend";

    // Notify inviter
    await db.insert(notifications).values({
      userId: invite.inviterId,
      title: "Study Pod Invitation Accepted",
      message: `${responderName} accepted your invitation! You are now connected in the AI Study Pod.`,
      type: "study_pod_accepted",
      link: "/dashboard/study-pod",
    });

    return NextResponse.json({
      success: true,
      status: "accepted",
      message: `You joined the Study Pod! You can now collaborate and compare defenses.`,
    });
  } else {
    await db
      .update(studyPodMemberships)
      .set({
        status: "rejected",
        updatedAt: now,
      })
      .where(eq(studyPodMemberships.id, inviteId));

    return NextResponse.json({
      success: true,
      status: "rejected",
      message: `Invitation declined.`,
    });
  }
}

/* ─── DELETE /api/study-pod/peers (Cancel Invite or Remove Peer) ── */
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Membership or invite ID is required." }, { status: 400 });

  await db
    .delete(studyPodMemberships)
    .where(
      and(
        eq(studyPodMemberships.id, id),
        or(
          eq(studyPodMemberships.inviterId, session.sub),
          eq(studyPodMemberships.inviteeId, session.sub)
        )
      )
    );

  return NextResponse.json({ success: true, message: "Removed successfully." });
}
