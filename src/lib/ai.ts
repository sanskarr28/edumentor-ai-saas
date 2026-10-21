// EduMentor AI — rule-based personalized learning insight engine.
// Analyzes a student's grades, submissions and attendance to generate
// actionable, human-readable coaching content without any external API.

export type SubjectPerformance = {
  subject: string;
  courseTitle: string;
  averageGrade: number | null;
  submissionsGraded: number;
  submissionsMissing: number;
  attendanceRate: number | null;
};

export type GeneratedInsight = {
  category: "strength" | "weakness" | "recommendation" | "studyplan" | "alert";
  title: string;
  content: string;
  metric: string | null;
};

export function generateInsightsForStudent(
  studentName: string,
  performances: SubjectPerformance[],
  overallAttendance: number | null,
): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];
  const firstName = studentName.split(" ")[0];

  const graded = performances.filter((p) => p.averageGrade !== null);
  const strongest = [...graded].sort((a, b) => (b.averageGrade ?? 0) - (a.averageGrade ?? 0))[0];
  const weakest = [...graded].sort((a, b) => (a.averageGrade ?? 0) - (b.averageGrade ?? 0))[0];

  if (strongest && strongest.averageGrade !== null) {
    insights.push({
      category: "strength",
      title: `Excelling in ${strongest.subject}`,
      content: `${firstName} is averaging ${Math.round(strongest.averageGrade)}% in ${strongest.courseTitle}. Consider stretch assignments or peer-mentoring opportunities to keep momentum high.`,
      metric: strongest.subject,
    });
  }

  if (weakest && weakest.averageGrade !== null && (strongest === undefined || weakest.courseTitle !== strongest.courseTitle)) {
    if (weakest.averageGrade < 75) {
      insights.push({
        category: "weakness",
        title: `Needs support in ${weakest.subject}`,
        content: `${firstName}'s average in ${weakest.courseTitle} is ${Math.round(weakest.averageGrade)}%. Recommend focused review sessions on recent topics and breaking assignments into smaller milestones.`,
        metric: weakest.subject,
      });
    }
  }

  for (const perf of performances) {
    if (perf.submissionsMissing > 0) {
      insights.push({
        category: "alert",
        title: `${perf.submissionsMissing} missing submission${perf.submissionsMissing > 1 ? "s" : ""} in ${perf.subject}`,
        content: `${firstName} has ${perf.submissionsMissing} outstanding assignment${perf.submissionsMissing > 1 ? "s" : ""} in ${perf.courseTitle}. Completing these promptly will prevent a compounding grade impact.`,
        metric: perf.subject,
      });
    }
  }

  if (overallAttendance !== null) {
    if (overallAttendance < 85) {
      insights.push({
        category: "alert",
        title: "Attendance trending low",
        content: `Overall attendance is at ${Math.round(overallAttendance)}%. Regular attendance strongly correlates with grade performance — a short check-in with ${firstName} could help identify blockers.`,
        metric: "Attendance",
      });
    } else {
      insights.push({
        category: "strength",
        title: "Consistent attendance",
        content: `${firstName} maintains a strong attendance record of ${Math.round(overallAttendance)}%, providing a solid foundation for steady academic progress.`,
        metric: "Attendance",
      });
    }
  }

  const overallAvg =
    graded.length > 0 ? graded.reduce((a, b) => a + (b.averageGrade ?? 0), 0) / graded.length : null;

  if (overallAvg !== null) {
    if (overallAvg >= 90) {
      insights.push({
        category: "recommendation",
        title: "Ready for enrichment challenges",
        content: `With an overall average of ${Math.round(overallAvg)}%, ${firstName} is well positioned for advanced electives, competitions, or independent research projects.`,
        metric: "Overall",
      });
    } else if (overallAvg >= 75) {
      insights.push({
        category: "recommendation",
        title: "Personalized study plan",
        content: `Focus 20-30 minutes daily on ${weakest?.subject ?? "core subjects"} using active recall and spaced repetition. Pair this with weekly progress check-ins to push the ${Math.round(overallAvg)}% average higher.`,
        metric: "Study Plan",
      });
    } else {
      insights.push({
        category: "studyplan",
        title: "Intervention study plan recommended",
        content: `${firstName}'s overall average of ${Math.round(overallAvg)}% suggests benefit from a structured intervention: shorter daily practice blocks, tutoring support, and closer teacher-parent communication.`,
        metric: "Study Plan",
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      category: "recommendation",
      title: "Building a performance baseline",
      content: `Not enough graded activity yet to generate deep insights for ${firstName}. Encourage submitting upcoming assignments so EduMentor AI can tailor recommendations.`,
      metric: null,
    });
  }

  return insights;
}
