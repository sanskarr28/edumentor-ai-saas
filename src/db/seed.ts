// Seed script for EduMentor AI — populates the database with realistic
// demo data so the app feels alive on first load.
// Run with: npx tsx src/db/seed.ts
import "dotenv/config";
import { db, pool } from "@/db";
import {
  aiInsights,
  announcements,
  assignments,
  attendanceRecords,
  courses,
  enrollments,
  notifications,
  parentLinks,
  submissions,
  users,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { colorForString } from "@/lib/utils";
import { generateInsightsForStudent, type SubjectPerformance } from "@/lib/ai";
import { sql } from "drizzle-orm";

const DEMO_PASSWORD = "password123";

function daysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Clearing existing data...");
  await db.execute(sql`truncate table
    ai_insights, notifications, announcements, attendance_records,
    submissions, assignments, enrollments, courses, parent_links, users
    restart identity cascade`);

  const passwordHash = await hashPassword(DEMO_PASSWORD);

  console.log("Creating users...");
  const [admin] = await db
    .insert(users)
    .values({
      name: "Alex Morgan",
      email: "admin@edumentor.ai",
      passwordHash,
      role: "admin",
      avatarColor: colorForString("admin@edumentor.ai"),
      bio: "Platform administrator overseeing EduMentor AI operations.",
    })
    .returning();

  const teacherSeeds = [
    { name: "Sarah Chen", email: "teacher@edumentor.ai", subject: "Mathematics" },
    { name: "David Kim", email: "david.kim@edumentor.ai", subject: "Physics" },
    { name: "Emily Davis", email: "emily.davis@edumentor.ai", subject: "English Literature" },
    { name: "Marcus Green", email: "marcus.green@edumentor.ai", subject: "History" },
    { name: "Nina Wong", email: "nina.wong@edumentor.ai", subject: "Biology" },
  ];
  const teachers = [];
  for (const t of teacherSeeds) {
    const [row] = await db
      .insert(users)
      .values({
        name: t.name,
        email: t.email,
        passwordHash,
        role: "teacher",
        subject: t.subject,
        avatarColor: colorForString(t.email),
        bio: `Faculty member teaching ${t.subject}.`,
      })
      .returning();
    teachers.push(row);
  }

  const studentSeeds = [
    { name: "Jordan Lee", email: "student@edumentor.ai", gradeLevel: "Grade 10" },
    { name: "Maya Patel", email: "maya.patel@edumentor.ai", gradeLevel: "Grade 10" },
    { name: "Liam Johnson", email: "liam.johnson@edumentor.ai", gradeLevel: "Grade 9" },
    { name: "Sophia Martinez", email: "sophia.martinez@edumentor.ai", gradeLevel: "Grade 11" },
    { name: "Ethan Brown", email: "ethan.brown@edumentor.ai", gradeLevel: "Grade 10" },
    { name: "Olivia Garcia", email: "olivia.garcia@edumentor.ai", gradeLevel: "Grade 9" },
    { name: "Noah Wilson", email: "noah.wilson@edumentor.ai", gradeLevel: "Grade 11" },
  ];
  const students = [];
  for (const s of studentSeeds) {
    const [row] = await db
      .insert(users)
      .values({
        name: s.name,
        email: s.email,
        passwordHash,
        role: "student",
        gradeLevel: s.gradeLevel,
        avatarColor: colorForString(s.email),
        bio: `${s.gradeLevel} student at EduMentor Academy.`,
      })
      .returning();
    students.push(row);
  }

  const parentSeeds = [
    { name: "Linda Lee", email: "parent@edumentor.ai", childEmail: "student@edumentor.ai" },
    { name: "Raj Patel", email: "raj.patel@edumentor.ai", childEmail: "maya.patel@edumentor.ai" },
    { name: "Carla Johnson", email: "carla.johnson@edumentor.ai", childEmail: "liam.johnson@edumentor.ai" },
  ];
  for (const p of parentSeeds) {
    const [row] = await db
      .insert(users)
      .values({
        name: p.name,
        email: p.email,
        passwordHash,
        role: "parent",
        avatarColor: colorForString(p.email),
        bio: "Actively engaged parent tracking academic progress.",
      })
      .returning();
    const child = students.find((s) => s.email === p.childEmail);
    if (child) {
      await db.insert(parentLinks).values({ parentId: row.id, studentId: child.id, relationship: "Guardian" });
    }
  }

  console.log("Creating courses...");
  const courseSeeds = [
    { title: "Algebra II", subject: "Mathematics", teacher: teachers[0], gradeLevel: "Grade 10", schedule: "Mon/Wed/Fri 9:00 AM", description: "Advanced algebraic concepts including functions, polynomials, and equations." },
    { title: "Geometry Foundations", subject: "Mathematics", teacher: teachers[0], gradeLevel: "Grade 9", schedule: "Tue/Thu 10:30 AM", description: "Introduction to geometric proofs, shapes, and spatial reasoning." },
    { title: "Physics I: Mechanics", subject: "Physics", teacher: teachers[1], gradeLevel: "Grade 11", schedule: "Mon/Wed 1:00 PM", description: "Newtonian mechanics, motion, forces, and energy conservation." },
    { title: "English Literature", subject: "English", teacher: teachers[2], gradeLevel: "Grade 10", schedule: "Tue/Thu 9:00 AM", description: "Critical analysis of classic and contemporary literary works." },
    { title: "World History", subject: "History", teacher: teachers[3], gradeLevel: "Grade 10", schedule: "Mon/Wed/Fri 11:00 AM", description: "Survey of global civilizations from antiquity to the modern era." },
    { title: "Biology Basics", subject: "Biology", teacher: teachers[4], gradeLevel: "Grade 9", schedule: "Tue/Thu 1:30 PM", description: "Foundational concepts in cellular biology, genetics, and ecosystems." },
  ];

  const createdCourses = [];
  for (const c of courseSeeds) {
    const [row] = await db
      .insert(courses)
      .values({
        title: c.title,
        subject: c.subject,
        description: c.description,
        teacherId: c.teacher.id,
        gradeLevel: c.gradeLevel,
        schedule: c.schedule,
        color: colorForString(c.title + c.subject),
        capacity: 28,
      })
      .returning();
    createdCourses.push(row);
  }

  console.log("Enrolling students...");
  // Enroll each student into 3 courses to make dashboards feel populated.
  for (const student of students) {
    const shuffled = [...createdCourses].sort(() => Math.random() - 0.5);
    const pickedCourses = shuffled.slice(0, 3);
    for (const course of pickedCourses) {
      await db.insert(enrollments).values({ courseId: course.id, studentId: student.id });
    }
  }

  console.log("Creating assignments...");
  const assignmentTitles = [
    "Homework Set 1",
    "Midterm Project",
    "Weekly Quiz",
    "Lab Report",
    "Essay Draft",
    "Final Review Packet",
  ];
  const createdAssignments = [];
  for (const course of createdCourses) {
    const count = randomBetween(2, 4);
    for (let i = 0; i < count; i++) {
      const dueOffset = randomBetween(-14, 10);
      const [row] = await db
        .insert(assignments)
        .values({
          courseId: course.id,
          title: `${pick(assignmentTitles)} — ${course.subject}`,
          description: `Complete the assigned tasks covering recent topics in ${course.title}.`,
          dueDate: daysFromNow(dueOffset),
          totalMarks: 100,
        })
        .returning();
      createdAssignments.push(row);
    }
  }

  console.log("Creating submissions and grades...");
  const enrollmentRows = await db.select().from(enrollments);
  const performanceMap = new Map<string, Map<string, SubjectPerformance>>();

  for (const assignment of createdAssignments) {
    const course = createdCourses.find((c) => c.id === assignment.courseId)!;
    const roster = enrollmentRows.filter((e) => e.courseId === assignment.courseId);
    const isPastDue = new Date(assignment.dueDate) < new Date();

    for (const enrollment of roster) {
      if (!isPastDue) continue; // future assignments remain pending
      const submissionChance = Math.random();
      if (submissionChance < 0.12) continue; // some students never submitted

      const isGraded = Math.random() < 0.8;
      const grade = isGraded ? randomBetween(58, 100) : null;
      const status = isGraded ? "graded" : "submitted";

      await db.insert(submissions).values({
        assignmentId: assignment.id,
        studentId: enrollment.studentId,
        content: "Submitted work covering the assigned topics with supporting examples and explanations.",
        status,
        submittedAt: daysFromNow(randomBetween(-20, -1)),
        grade,
        feedback: isGraded ? pick([
          "Great job overall, keep up the consistent effort!",
          "Good work — review the second section for extra clarity.",
          "Solid understanding shown, minor errors in calculations.",
          "Well organized response with clear reasoning.",
        ]) : null,
        aiFeedback: isGraded && grade !== null ? (grade >= 90
          ? "Outstanding work! Keep challenging yourself with deeper practice problems."
          : grade >= 75
            ? "Solid effort. Review the topics you missed to push toward mastery."
            : grade >= 60
              ? "You're on the right track — targeted revision on key concepts will help a lot."
              : "This is a good opportunity to revisit the fundamentals.") : null,
      });

      if (grade !== null) {
        const studentMap = performanceMap.get(enrollment.studentId) ?? new Map<string, SubjectPerformance>();
        const perf = studentMap.get(course.id) ?? {
          subject: course.subject,
          courseTitle: course.title,
          averageGrade: null,
          submissionsGraded: 0,
          submissionsMissing: 0,
          attendanceRate: null,
        };
        const totalScoreSoFar = (perf.averageGrade ?? 0) * perf.submissionsGraded + grade;
        perf.submissionsGraded += 1;
        perf.averageGrade = totalScoreSoFar / perf.submissionsGraded;
        studentMap.set(course.id, perf);
        performanceMap.set(enrollment.studentId, studentMap);
      }
    }
  }

  console.log("Recording attendance...");
  const today = new Date();
  const attendanceByStudent = new Map<string, { present: number; total: number }>();
  for (const course of createdCourses) {
    const roster = enrollmentRows.filter((e) => e.courseId === course.id);
    for (let dayOffset = 20; dayOffset >= 1; dayOffset--) {
      const date = new Date(today);
      date.setDate(date.getDate() - dayOffset);
      const day = date.getDay();
      if (day === 0 || day === 6) continue; // skip weekends

      for (const enrollment of roster) {
        const roll = Math.random();
        const status = roll < 0.82 ? "present" : roll < 0.9 ? "late" : roll < 0.96 ? "excused" : "absent";
        await db.insert(attendanceRecords).values({
          courseId: course.id,
          studentId: enrollment.studentId,
          date: isoDate(date),
          status,
          markedById: course.teacherId,
        });
        const stat = attendanceByStudent.get(enrollment.studentId) ?? { present: 0, total: 0 };
        stat.total += 1;
        if (status === "present" || status === "late") stat.present += 1;
        attendanceByStudent.set(enrollment.studentId, stat);
      }
    }
  }

  console.log("Generating AI insights...");
  for (const student of students) {
    const perfMap = performanceMap.get(student.id);
    const performances = perfMap ? [...perfMap.values()] : [];
    const attendanceStat = attendanceByStudent.get(student.id);
    const overallAttendance = attendanceStat && attendanceStat.total > 0 ? (attendanceStat.present / attendanceStat.total) * 100 : null;
    const generated = generateInsightsForStudent(student.name, performances, overallAttendance);
    if (generated.length > 0) {
      await db.insert(aiInsights).values(
        generated.map((g) => ({
          studentId: student.id,
          category: g.category,
          title: g.title,
          content: g.content,
          metric: g.metric,
        })),
      );
    }
  }

  console.log("Posting announcements...");
  const announcementSeeds = [
    { title: "Welcome to the new semester!", message: "We're excited to kick off the semester. Please review your course schedules and reach out with any questions.", audience: "all" as const, priority: "info" as const, authorId: admin.id },
    { title: "Parent-Teacher Conference Week", message: "Parent-teacher conferences will be held next week. Please check your email for scheduling links.", audience: "parent" as const, priority: "warning" as const, authorId: admin.id },
    { title: "Midterm Grades Posted", message: "Midterm grades have been posted to the gradebook. Reach out to your instructor with any questions.", audience: "student" as const, priority: "info" as const, authorId: teachers[0].id },
    { title: "Faculty Meeting Reminder", message: "Monthly faculty meeting is scheduled for Friday at 3 PM in the main conference room.", audience: "teacher" as const, priority: "info" as const, authorId: admin.id },
    { title: "Lab Safety Guidelines Updated", message: "Please review the updated lab safety guidelines before the next practical session.", audience: "all" as const, priority: "urgent" as const, authorId: teachers[1].id, courseId: createdCourses[2].id },
  ];
  for (const a of announcementSeeds) {
    await db.insert(announcements).values(a);
  }

  console.log("Seeding a few notifications...");
  const allUsers = [admin, ...teachers, ...students];
  for (const u of allUsers.slice(0, 6)) {
    await db.insert(notifications).values({
      userId: u.id,
      title: "Welcome to EduMentor AI 🎉",
      message: "Explore your personalized dashboard to get started.",
      type: "system",
    });
  }

  console.log("✅ Seed complete!");
  console.log("Demo accounts (password: password123):");
  console.log("  Admin:   admin@edumentor.ai");
  console.log("  Faculty: teacher@edumentor.ai");
  console.log("  Student: student@edumentor.ai");
  console.log("  Parent:  parent@edumentor.ai");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
