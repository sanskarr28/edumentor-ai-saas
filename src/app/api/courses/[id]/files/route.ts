import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { courseFiles, courses, users } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const rows = await db
    .select({
      id: courseFiles.id,
      fileName: courseFiles.fileName,
      fileUrl: courseFiles.fileUrl,
      uploaderName: users.name,
      createdAt: courseFiles.createdAt,
    })
    .from(courseFiles)
    .leftJoin(users, eq(users.id, courseFiles.uploadedById))
    .where(eq(courseFiles.courseId, id))
    .orderBy(courseFiles.createdAt);
  return NextResponse.json({ files: rows });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Only teachers or admins can upload course materials" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.fileName || !body?.fileUrl) {
    return NextResponse.json({ error: "fileName and fileUrl are required" }, { status: 400 });
  }
  // Verify course exists and teacher owns it
  const courseRow = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  if (!courseRow[0]) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (session.role === "teacher" && courseRow[0].teacherId !== session.sub) {
    return NextResponse.json({ error: "You can only upload to your own courses" }, { status: 403 });
  }
  const inserted = await db
    .insert(courseFiles)
    .values({ courseId: id, uploadedById: session.sub, fileName: body.fileName, fileUrl: body.fileUrl })
    .returning();
  return NextResponse.json({ file: inserted[0] }, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || (session.role !== "teacher" && session.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");
  if (!fileId) return NextResponse.json({ error: "fileId required" }, { status: 400 });
  await db.delete(courseFiles).where(eq(courseFiles.id, fileId));
  return NextResponse.json({ success: true });
}
