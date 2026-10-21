import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { assignments, courses, notifications, submissions } from "@/db/schema";
import { getSession } from "@/lib/auth";

const updateSchema = z.object({
  grade: z.number().int().min(0).max(1000),
  feedback: z.string().max(2000).optional(),
});

function aiEncouragement(percentage: number) {
  if (percentage >= 90) return "Outstanding work! Keep challenging yourself with deeper practice problems.";
  if (percentage >= 75) return "Solid effort. Review the topics you missed to push toward mastery.";
  if (percentage >= 60) return "You're on the right track — targeted revision on key concepts will help a lot.";
  return "This is a good opportunity to revisit the fundamentals. Consider scheduling a review session or tutoring.";
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only faculty can grade submissions" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const rows = await db
    .select({ submission: submissions, assignment: assignments, course: courses })
    .from(submissions)
    .innerJoin(assignments, eq(assignments.id, submissions.assignmentId))
    .innerJoin(courses, eq(courses.id, assignments.courseId))
    .where(eq(submissions.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  if (session.role === "teacher" && row.course.teacherId !== session.sub) {
    return NextResponse.json({ error: "Not permitted" }, { status: 403 });
  }

  const percentage = Math.round((parsed.data.grade / row.assignment.totalMarks) * 100);
  const aiFeedback = aiEncouragement(percentage);

  const updated = await db
    .update(submissions)
    .set({
      grade: parsed.data.grade,
      feedback: parsed.data.feedback ?? null,
      aiFeedback,
      status: "graded",
      updatedAt: new Date(),
    })
    .where(eq(submissions.id, id))
    .returning();

  await db.insert(notifications).values({
    userId: row.submission.studentId,
    title: `Grade posted: ${row.assignment.title}`,
    message: `You scored ${parsed.data.grade}/${row.assignment.totalMarks} (${percentage}%).`,
    type: "grade",
    link: "/dashboard/grades",
  });

  return NextResponse.json({ submission: updated[0] });
}
