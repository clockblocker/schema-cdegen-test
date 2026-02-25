import type { RawScoringQuestionGroup } from "~/consumer-code/questionnaire-factory";

export const LIBRARY_SERVER_SCORING_QUESTION_GROUPS = [
	{
		questions: [
			{
				questionId: "LIB_Q01",
				questionText: "Question 1 answer",
			},
			{
				questionId: "LIB_Q02",
				questionText: "Question 2 answer",
			},
		],
		groupWeight: 1,
		answersTree: {
			answerText: "",
			LIB_Q01_A01: {
				answerText: "Yes",
				LIB_Q02_A01: {
					answerText: "Yes",
					weight: 0,
					grade: "LowRisk",
				},
				LIB_Q02_A02: {
					answerText: "No",
					weight: 3,
					grade: "MediumHighRisk",
				},
			},
			LIB_Q01_A02: {
				answerText: "No",
				LIB_Q02_A03: {
					answerText: "Yes",
					weight: 2,
					grade: "MediumRisk",
				},
				LIB_Q02_A04: {
					answerText: "No",
					weight: 5,
					grade: "HighRisk_Trigger",
				},
			},
		},
	},
] satisfies RawScoringQuestionGroup[];
