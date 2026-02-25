import type { ServerScoringAnswerTree } from "./server-scoring-answer-tree";

export type ServerScoringQuestionGroup = {
	questions: Array<{
		questionId: string;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: ServerScoringAnswerTree;
};

export const SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS = [
	{
		questions: [
			{
				questionId: "SM_Q01",
				questionText: "How automated is daily stock replenishment?",
			},
			{
				questionId: "SM_Q02",
				questionText: "How often are stock variances reconciled?",
			},
			{
				questionId: "SM_Q03",
				questionText: "What is the incident follow-up SLA?",
			},
		],
		groupWeight: 3,
		answersTree: {
			answerText: "",
			SM_Q01_A01: {
				answerText: "Fully automated with exception workflow",
				SM_Q02_A01: {
					answerText: "Real-time variance reconciliation",
					SM_Q03_A01: {
						answerText: "< 1 hour",
						weight: 0,
						grade: "LowRisk",
					},
					SM_Q03_A02: {
						answerText: "Within same shift",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM_Q03_A03: {
						answerText: "Within 24 hours",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM_Q02_A02: {
					answerText: "Daily end-of-day reconciliation",
					SM_Q03_A04: {
						answerText: "< 4 hours",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM_Q03_A05: {
						answerText: "Same business day",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM_Q02_A03: {
					answerText: "Weekly trend-only reconciliation",
					SM_Q03_A06: {
						answerText: "Next business day",
						weight: 2,
						grade: "MediumRisk",
					},
					SM_Q03_A07: {
						answerText: "Within 48 hours",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
			},
			SM_Q01_A02: {
				answerText: "Semi-automated with manual approvals",
				SM_Q02_A04: {
					answerText: "Daily with supervisor sign-off",
					SM_Q03_A08: {
						answerText: "Same day",
						weight: 2,
						grade: "MediumRisk",
					},
					SM_Q03_A09: {
						answerText: "Next business day",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM_Q02_A05: {
					answerText: "Weekly with manual root-cause review",
					SM_Q03_A10: {
						answerText: "Within 48 hours",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM_Q03_A11: {
						answerText: "> 3 business days",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q03_A12: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q02_A06: {
					answerText: "Monthly reconciliation only",
					SM_Q03_A13: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q03_A14: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
			SM_Q01_A03: {
				answerText: "Manual process only",
				SM_Q02_A07: {
					answerText: "Ad-hoc spot checks",
					SM_Q03_A15: {
						answerText: "> 3 business days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q03_A16: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q02_A08: {
					answerText: "No formal reconciliation",
					SM_Q03_A17: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q03_A18: {
						answerText: "Incidents not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q02_A09: {
					answerText: "Paper logs reconciled monthly",
					SM_Q03_A19: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q03_A20: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
		},
	},
	{
		questions: [
			{
				questionId: "SM_Q04",
				questionText: "How is cold-chain temperature tracked?",
			},
			{
				questionId: "SM_Q05",
				questionText: "How often are hygiene audits performed?",
			},
			{
				questionId: "SM_Q06",
				questionText: "How quickly are non-conformities closed?",
			},
		],
		groupWeight: 4,
		answersTree: {
			answerText: "",
			SM_Q04_A01: {
				answerText: "Continuous IoT monitoring with alerts",
				SM_Q05_A01: {
					answerText: "Daily hygiene audits",
					SM_Q06_A01: {
						answerText: "< 24 hours",
						weight: 0,
						grade: "LowRisk",
					},
					SM_Q06_A02: {
						answerText: "Within 72 hours",
						weight: 1,
						grade: "LowMediumRisk",
					},
				},
				SM_Q05_A02: {
					answerText: "Weekly hygiene audits",
					SM_Q06_A03: {
						answerText: "Within 72 hours",
						weight: 2,
						grade: "MediumRisk",
					},
					SM_Q06_A04: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM_Q05_A03: {
					answerText: "Monthly hygiene audits",
					SM_Q06_A05: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM_Q06_A06: {
						answerText: "> 7 days",
						weight: 4,
						grade: "HighRisk",
					},
				},
			},
			SM_Q04_A02: {
				answerText: "Manual logs twice a day",
				SM_Q05_A04: {
					answerText: "Weekly",
					SM_Q06_A07: {
						answerText: "Within 72 hours",
						weight: 2,
						grade: "MediumRisk",
					},
					SM_Q06_A08: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM_Q05_A05: {
					answerText: "Monthly",
					SM_Q06_A09: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q06_A10: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q05_A06: {
					answerText: "Only after incidents",
					SM_Q06_A11: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q06_A12: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
			SM_Q04_A03: {
				answerText: "No systematic tracking",
				SM_Q05_A07: {
					answerText: "Quarterly",
					SM_Q06_A13: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q06_A14: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q05_A08: {
					answerText: "Never",
					SM_Q06_A15: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q06_A16: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q05_A09: {
					answerText: "Paper logbooks only",
					SM_Q06_A17: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q06_A18: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
		},
	},
	{
		questions: [
			{
				questionId: "SM_Q07",
				questionText: "What is the payment fraud control level?",
			},
			{
				questionId: "SM_Q08",
				questionText: "How mature is access management?",
			},
			{
				questionId: "SM_Q09",
				questionText: "How often are incidents stress-tested?",
			},
		],
		groupWeight: 3,
		answersTree: {
			answerText: "",
			SM_Q07_A01: {
				answerText: "Real-time fraud engine",
				SM_Q08_A01: {
					answerText: "Role-based with quarterly recertification",
					SM_Q09_A01: {
						answerText: "Quarterly",
						weight: 0,
						grade: "LowRisk",
					},
					SM_Q09_A02: {
						answerText: "Bi-annually",
						weight: 1,
						grade: "LowMediumRisk",
					},
				},
				SM_Q08_A02: {
					answerText: "Role-based with annual recertification",
					SM_Q09_A03: {
						answerText: "Bi-annually",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM_Q09_A04: {
						answerText: "Ad-hoc",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM_Q08_A03: {
					answerText: "Automated approvals with break-glass access",
					SM_Q09_A05: {
						answerText: "Quarterly",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM_Q09_A06: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
			},
			SM_Q07_A02: {
				answerText: "Rule-based checks only",
				SM_Q08_A04: {
					answerText: "Shared credentials still exist",
					SM_Q09_A07: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM_Q09_A08: {
						answerText: "Never",
						weight: 4,
						grade: "HighRisk",
					},
				},
				SM_Q08_A05: {
					answerText: "Role-based, annual recertification",
					SM_Q09_A09: {
						answerText: "Bi-annually",
						weight: 2,
						grade: "MediumRisk",
					},
					SM_Q09_A10: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM_Q08_A06: {
					answerText: "Privileged access via ticket queue only",
					SM_Q09_A11: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM_Q09_A12: {
						answerText: "Never",
						weight: 4,
						grade: "HighRisk",
					},
				},
			},
			SM_Q07_A03: {
				answerText: "No dedicated fraud controls",
				SM_Q08_A07: {
					answerText: "Shared credentials common",
					SM_Q09_A13: {
						answerText: "Never",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q09_A14: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM_Q08_A08: {
					answerText: "No access governance",
					SM_Q09_A15: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM_Q09_A16: {
						answerText: "Ad-hoc",
						weight: 4,
						grade: "HighRisk",
					},
				},
				SM_Q08_A09: {
					answerText: "Manual access lists, no approvals",
					SM_Q09_A17: {
						answerText: "Ad-hoc",
						weight: 4,
						grade: "HighRisk",
					},
					SM_Q09_A18: {
						answerText: "Never",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
		},
	},
	{
		questions: [
			{
				questionId: "SM_Q10",
				questionText: "How complete is mandatory staff training?",
			},
			{
				questionId: "SM_Q11",
				questionText: "How mature are waste reduction controls?",
			},
		],
		groupWeight: 2,
		answersTree: {
			answerText: "",
			SM_Q10_A01: {
				answerText: "> 98% completion",
				SM_Q11_A01: {
					answerText: "Measured weekly with targets",
					weight: 0,
					grade: "LowRisk",
				},
				SM_Q11_A02: {
					answerText: "Measured monthly",
					weight: 1,
					grade: "LowMediumRisk",
				},
				SM_Q11_A03: {
					answerText: "Measured quarterly",
					weight: 2,
					grade: "MediumRisk",
				},
			},
			SM_Q10_A02: {
				answerText: "85%-98% completion",
				SM_Q11_A04: {
					answerText: "Measured monthly",
					weight: 2,
					grade: "MediumRisk",
				},
				SM_Q11_A05: {
					answerText: "Tracked but no target",
					weight: 3,
					grade: "MediumHighRisk",
				},
				SM_Q11_A06: {
					answerText: "Tracked quarterly",
					weight: 4,
					grade: "HighRisk",
				},
			},
			SM_Q10_A03: {
				answerText: "< 85% completion",
				SM_Q11_A07: {
					answerText: "Not tracked",
					weight: 5,
					grade: "HighRisk_Trigger",
				},
				SM_Q11_A08: {
					answerText: "Tracked quarterly",
					weight: 4,
					grade: "HighRisk",
				},
				SM_Q11_A09: {
					answerText: "Measured yearly only",
					weight: 5,
					grade: "HighRisk_Trigger",
				},
			},
		},
	},
] satisfies ServerScoringQuestionGroup[];
