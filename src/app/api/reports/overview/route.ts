import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  announcements,
  assignments,
  attendanceRecords,
  courses,
  enrollments,
  parentLinks,
  submissions,
  users,
} from "@/db/schema";
import { getSession } from "@/lib/auth";
import { percentage } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (session.role === "admin") {
    const [allUsers, allCourses, allAssignments, allSubmissions, allAttendance, allAnnouncements] = await Promise.all([
      db.select().from(users),
      db.select().from(courses),
      db.select().from(assignments),
      db.select().from(submissions),
      db.select().from(attendanceRecords),
      db.select().from(announcements),
    ]);

    const roleCounts = { admin: 0, teacher: 0, student: 0, parent: 0 } as Record<string, number>;
    for (const u of allUsers) roleCounts[u.role] = (roleCounts[u.role] ?? 0) + 1;

    const gradedSubs = allSubmissions.filter((s) => s.grade !== null);
    const avgGrade = gradedSubs.length
      ? Math.round(
          gradedSubs.reduce((acc, s) => {
            const a = allAssignments.find((x) => x.id === s.assignmentId);
            return acc + ((s.grade ?? 0) / (a?.totalMarks ?? 100)) * 100;
          }, 0) / gradedSubs.length,
        )
      : 0;

    const present = allAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = allAttendance.length ? percentage(present, allAttendance.length) : 0;

    return NextResponse.json({
      role: "admin",
      stats: {
        totalUsers: allUsers.length,
        roleCounts,
        totalCourses: allCourses.length,
        totalAssignments: allAssignments.length,
        totalSubmissions: allSubmissions.length,
        avgGrade,
        attendanceRate,
        totalAnnouncements: allAnnouncements.length,
      },
      courseSubjectBreakdown: Object.entries(
        allCourses.reduce<Record<string, number>>((acc, c) => {
          acc[c.subject] = (acc[c.subject] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([subject, count]) => ({ subject, count })),
    });
  }

  if (session.role === "teacher") {
    const myCourses = await db.select().from(courses).where(eq(courses.teacherId, session.sub));
    const courseIds = myCourses.map((c) => c.id);
    const [myAssignments, myEnrollments, myAttendance] = await Promise.all([
      courseIds.length ? db.select().from(assignments).where(inArray(assignments.courseId, courseIds)) : Promise.resolve([]),
      courseIds.length ? db.select().from(enrollments).where(inArray(enrollments.courseId, courseIds)) : Promise.resolve([]),
      courseIds.length ? db.select().from(attendanceRecords).where(inArray(attendanceRecords.courseId, courseIds)) : Promise.resolve([]),
    ]);
    const assignmentIds = myAssignments.map((a) => a.id);
    const mySubmissions = assignmentIds.length
      ? await db.select().from(submissions).where(inArray(submissions.assignmentId, assignmentIds))
      : [];
    const gradedSubs = mySubmissions.filter((s) => s.grade !== null);
    const avgGrade = gradedSubs.length
      ? Math.round(
          gradedSubs.reduce((acc, s) => {
            const a = myAssignments.find((x) => x.id === s.assignmentId);
            return acc + ((s.grade ?? 0) / (a?.totalMarks ?? 100)) * 100;
          }, 0) / gradedSubs.length,
        )
      : 0;
    const present = myAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = myAttendance.length ? percentage(present, myAttendance.length) : 0;
    const pendingGrading = mySubmissions.filter((s) => s.status === "submitted" || s.status === "late").length;

    return NextResponse.json({
      role: "teacher",
      stats: {
        totalCourses: myCourses.length,
        totalStudents: new Set(myEnrollments.map((e) => e.studentId)).size,
        totalAssignments: myAssignments.length,
        pendingGrading,
        avgGrade,
        attendanceRate,
      },
      courses: myCourses.map((c) => ({
        id: c.id,
        title: c.title,
        students: myEnrollments.filter((e) => e.courseId === c.id).length,
        color: c.color,
      })),
    });
  }

  if (session.role === "student") {
    const myEnrollments = await db.select().from(enrollments).where(eq(enrollments.studentId, session.sub));
    const courseIds = myEnrollments.map((e) => e.courseId);
    const myCourses = courseIds.length ? await db.select().from(courses).where(inArray(courses.id, courseIds)) : [];
    const myAssignments = courseIds.length
      ? await db.select().from(assignments).where(inArray(assignments.courseId, courseIds))
      : [];
    const assignmentIds = myAssignments.map((a) => a.id);
    const mySubmissions = assignmentIds.length
      ? await db.select().from(submissions).where(inArray(submissions.assignmentId, assignmentIds))
      : [];
    const myOwnSubmissions = mySubmissions.filter((s) => s.studentId === session.sub);
    const graded = myOwnSubmissions.filter((s) => s.grade !== null);
    const avgGrade = graded.length
      ? Math.round(
          graded.reduce((acc, s) => {
            const a = myAssignments.find((x) => x.id === s.assignmentId);
            return acc + ((s.grade ?? 0) / (a?.totalMarks ?? 100)) * 100;
          }, 0) / graded.length,
        )
      : 0;
    const myAttendance = courseIds.length
      ? await db.select().from(attendanceRecords).where(inArray(attendanceRecords.courseId, courseIds))
      : [];
    const ownAttendance = myAttendance.filter((a) => a.studentId === session.sub);
    const present = ownAttendance.filter((a) => a.status === "present" || a.status === "late").length;
    const attendanceRate = ownAttendance.length ? percentage(present, ownAttendance.length) : 0;
    const pendingAssignments = myAssignments.filter(
      (a) => !myOwnSubmissions.some((s) => s.assignmentId === a.id && s.status !== "pending"),
    ).length;

    return NextResponse.json({
      role: "student",
      stats: {
        totalCourses: myCourses.length,
        totalAssignments: myAssignments.length,
        pendingAssignments,
        avgGrade,
        attendanceRate,
      },
      subjectGrades: myCourses.map((c) => {
        const ids = myAssignments.filter((a) => a.courseId === c.id).map((a) => a.id);
        const subs = graded.filter((s) => ids.includes(s.assignmentId));
        const avg = subs.length
          ? Math.round(
              subs.reduce((acc, s) => {
                const a = myAssignments.find((x) => x.id === s.assignmentId);
                return acc + ((s.grade ?? 0) / (a?.totalMarks ?? 100)) * 100;
              }, 0) / subs.length,
            )
          : 0;
        return { subject: c.subject, value: avg, color: c.color };
      }),
    });
  }

  // parent
  const links = await db.select().from(parentLinks).where(eq(parentLinks.parentId, session.sub));
  const children = await Promise.all(
    links.map(async (link) => {
      const childRows = await db.select().from(users).where(eq(users.id, link.studentId)).limit(1);
      const child = childRows[0];
      if (!child) return null;
      const childEnrollments = await db.select().from(enrollments).where(eq(enrollments.studentId, link.studentId));
      const courseIds = childEnrollments.map((e) => e.courseId);
      const childCourses = courseIds.length ? await db.select().from(courses).where(inArray(courses.id, courseIds)) : [];
      const childAssignments = courseIds.length
        ? await db.select().from(assignments).where(inArray(assignments.courseId, courseIds))
        : [];
      const assignmentIds = childAssignments.map((a) => a.id);
      const childSubmissions = assignmentIds.length
        ? await db.select().from(submissions).where(inArray(submissions.assignmentId, assignmentIds))
        : [];
      const owned = childSubmissions.filter((s) => s.studentId === link.studentId && s.grade !== null);
      const avgGrade = owned.length
        ? Math.round(
            owned.reduce((acc, s) => {
              const a = childAssignments.find((x) => x.id === s.assignmentId);
              return acc + ((s.grade ?? 0) / (a?.totalMarks ?? 100)) * 100;
            }, 0) / owned.length,
          )
        : 0;
      const childAttendance = courseIds.length
        ? await db.select().from(attendanceRecords).where(inArray(attendanceRecords.courseId, courseIds))
        : [];
      const ownAttendance = childAttendance.filter((a) => a.studentId === link.studentId);
      const present = ownAttendance.filter((a) => a.status === "present" || a.status === "late").length;
      const attendanceRate = ownAttendance.length ? percentage(present, ownAttendance.length) : 0;

      return {
        id: child.id,
        name: child.name,
        avatarColor: child.avatarColor,
        gradeLevel: child.gradeLevel,
        totalCourses: childCourses.length,
        avgGrade,
        attendanceRate,
      };
    }),
  );

  const validChildren = children.filter(Boolean);
  return NextResponse.json({ role: "parent", children: validChildren });
}
