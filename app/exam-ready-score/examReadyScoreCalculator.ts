// examReadyScore.ts
// Assumes these already exist in your project:
//   - Quiz type
//   - retrieveSubjectTopic(subjectLevel, subject): string[] | undefined
//   - subjectPastelBgColors: Record<string, string>
//   - quizzes: Quiz[]  (the current user's quizzes)

import { retrieveSubjectTopic } from "@/utils/subjects";
import { subjectPastelBgColors } from "@/utils/subjects";


// ---------- Types ----------
type TargetGrade = "A" | "B";
export type ReadinessStatus =
	| "Just Getting Started"
	| "Building Momentum"
	| "Getting There"
	| "Almost Ready"
	| "Exam Ready";

export type TopicInsight = {
	topic: string;
	score: number | null; // null = not attempted yet
	status: "strong" | "needs_work" | "not_started";
};

export type ExamReadyScore = {
	// Header / share card
	subject: string;
	subjectLevel: string;
	targetGrade: TargetGrade;
	examDate: Date;
	daysUntilExam: number;
	theme: { backgroundColor: string };

	// 1. Overall score (the glanceable number)
	overall: {
		score: number; // 0-100
		status: ReadinessStatus;
		headline: string; // e.g. "You're 72% ready for your Higher Biology A"
	};

	// 2. Average score needed on quizzes
	quizTarget: {
		averageNeeded: number; // % average to hit on quizzes
		currentAverage: number | null; // average across tested topics
	};

	// 3. Simple plan
	plan: {
		title: string;
		description: string;
		strategy: { action: string; detail: string }[];
		focusTopics: string[];
		quizzesPerWeek: number;
		totalQuizzesNeeded: number;
	};

	// Light stats for the share card
	stats: {
		topicsCovered: number;
		totalTopics: number;
		quizzesTaken: number;
		strongestTopics: TopicInsight[];
		weakestTopics: TopicInsight[];
	};
};

// ---------- Config ----------

// Quiz average the student should aim for to be safe on the real exam.
// (Set slightly above the grade boundary: A = 70%, B = 60%.)
const QUIZ_AVERAGE_NEEDED: Record<TargetGrade, number> = { A: 80, B: 70 };

const DEFAULT_THEME_COLOUR = "#e3eef8";
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// ---------- Helpers ----------

// Weights the latest 3 attempts on a topic (newest counts most),
// so improvement is rewarded and old bad scores fade.
function topicScore(topicQuizzes: SavedQuiz[]): number | null {
	if (topicQuizzes.length === 0) return null;

	const latest = [...topicQuizzes]
		.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
		.slice(-3); // oldest -> newest

	let weighted = 0;
	let weightTotal = 0;
	latest.forEach((q, i) => {
		const weight = i + 1; // 1, 2, 3 (newest = highest)
		weighted += q.score * weight;
		weightTotal += weight;
	});
	return weighted / weightTotal;
}

function getStatus(score: number): ReadinessStatus {
	if (score >= 90) return "Exam Ready";
	if (score >= 75) return "Almost Ready";
	if (score >= 50) return "Getting There";
	if (score >= 25) return "Building Momentum";
	return "Just Getting Started";
}

// ---------- Main function ----------

export function createExamReadyScore(subjectLevel: string, subject: string, targetGrade: TargetGrade, examDate: Date, quizzes: SavedQuiz[]): ExamReadyScore {
	const topics = retrieveSubjectTopic(subjectLevel, subject) ?? [];
	const averageNeeded = QUIZ_AVERAGE_NEEDED[targetGrade];

	// Only quizzes for this level + subject + a valid topic
	const relevantQuizzes = quizzes.filter((q) =>
		q.subjectLevel === subjectLevel &&
		q.subject === subject &&
		topics.includes(q.topic)
	);

	// Per-topic breakdown
	const insights: (TopicInsight & { gap: number })[] = topics.map((topic) => {
		const score = topicScore(relevantQuizzes.filter((q) => q.topic === topic));
		const status: TopicInsight["status"] = 
			score === null ? "not_started" : score >= averageNeeded ? "strong" : "needs_work";
		return {
			topic,
			score: score === null ? null : Math.round(score),
			status,
			gap: Math.max(0, averageNeeded - (score ?? 0)),
		};
	});

	const tested = insights.filter((t) => t.score !== null);
	const strong = insights.filter((t) => t.status === "strong");

	// Overall readiness: how close each topic is to the target (untested = 0)
	const overallScore =
		topics.length === 0
			? 0
			: Math.round(
					(insights.reduce((sum, t) => sum + Math.min((t.score ?? 0) / averageNeeded, 1), 0) /
						topics.length) *
						100
			  );

	const currentAverage =
		tested.length === 0
			? null
			: Math.round(tested.reduce((sum, t) => sum + (t.score as number), 0) / tested.length);

	// Time left
	const daysUntilExam = Math.max(
		0,
		Math.ceil((new Date(examDate).getTime() - Date.now()) / MS_PER_DAY)
	);
	const weeksLeft = Math.max(1, Math.ceil(daysUntilExam / 7));

	// Workload: untested topics need ~2 quizzes, weak ones 1-2 depending on gap
	const totalQuizzesNeeded = insights.reduce((sum, t) => {
		if (t.status === "strong") return sum;
		if (t.status === "not_started") return sum + 2;
		return sum + (t.gap > 15 ? 2 : 1);
	}, 0);
	const quizzesPerWeek = totalQuizzesNeeded === 0 ? 1 : Math.ceil(totalQuizzesNeeded / weeksLeft);

	// Focus topics: biggest gaps first
	const needsWork = insights
		.filter((t) => t.status !== "strong")
		.sort((a, b) => b.gap - a.gap);
	const focusTopics = needsWork.slice(0, 3).map((t) => t.topic);

	// Plan copy
	const levelSubject = `${subjectLevel} ${subject}`;
	let title: string;
	let description: string;

	if (daysUntilExam === 0) {
		title = "Exam Day Ready";
		description = `Your ${levelSubject} exam is here. Do a light review of your Grxnd notes, trust your prep and get some rest.`;
	} else if (totalQuizzesNeeded === 0) {
		title = "Stay Sharp";
		description = `You're hitting your ${targetGrade} target across every ${subject} topic. Keep your edge with a few mixed quizzes each week until exam day.`;
	} else if (daysUntilExam <= 7) {
		title = "Final Sprint";
		description = `${daysUntilExam} day${daysUntilExam === 1 ? "" : "s"} to go. Put all your energy into your weakest topics and lock in as many marks as you can.`;
	} else if (daysUntilExam <= 28) {
		title = "Focused Push";
		description = `${weeksLeft} weeks to go. A steady ${quizzesPerWeek} quizzes a week on your weak spots will get you to a ${targetGrade}.`;
	} else {
		title = "Steady Build";
		description = `You have ${weeksLeft} weeks, which is plenty of time. Cover every topic first, then sharpen the weak ones.`;
	}

	const strategy: { action: string; detail: string }[] = [];

	const untested = insights.filter((t) => t.status === "not_started");
	if (untested.length > 0) {
		strategy.push({
			action: "Cover every topic",
			detail: `Take your first quiz on ${untested.length} untouched topic${untested.length === 1 ? "" : "s"} on Grxnd so we can see where you really stand.`,
		});
	}
	if (focusTopics.length > 0) {
		strategy.push({
			action: "Make notes on weak topics",
			detail: `Write Grxnd notes on ${focusTopics.join(", ")} before you quiz, then retake the quiz to lock it in.`,
		});
		strategy.push({
			action: `Hit ${averageNeeded}% on quizzes`,
			detail: `Aim for ${quizzesPerWeek} quiz${quizzesPerWeek === 1 ? "" : "zes"} a week and keep retaking until you're consistently at ${averageNeeded}% or above.`,
		});
	} else {
		strategy.push({
			action: "Keep quizzing",
			detail: `Mix up your topics on Grxnd each week and keep your quiz average above ${averageNeeded}%.`,
		});
	}
	strategy.push({
		action: "Review before exam day",
		detail: "Re-read your notes and redo your lowest-scoring quizzes in the final week.",
	});

	return {
		subject,
		subjectLevel,
		targetGrade,
		examDate,
		daysUntilExam,
		theme: { backgroundColor: subjectPastelBgColors[subject] ?? DEFAULT_THEME_COLOUR },

		overall: {
			score: overallScore,
			status: getStatus(overallScore),
			headline: `You're ${overallScore}% ready for your ${levelSubject} ${targetGrade}`,
		},

		quizTarget: {
			averageNeeded,
			currentAverage,
		},

		plan: {
			title,
			description,
			strategy,
			focusTopics,
			quizzesPerWeek,
			totalQuizzesNeeded,
		},

		stats: {
			topicsCovered: tested.length,
			totalTopics: topics.length,
			quizzesTaken: relevantQuizzes.length,
			strongestTopics: [...strong]
				.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
				.slice(0, 3)
				.map(({ gap, ...t }) => t),
			weakestTopics: needsWork.slice(0, 3).map(({ gap, ...t }) => t),
		},
	};
}