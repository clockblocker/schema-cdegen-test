export const SUPERMARKET_QUESTION_IDS = [
	"SM_Q01",
	"SM_Q02",
	"SM_Q03",
	"SM_Q04",
	"SM_Q05",
	"SM_Q06",
	"SM_Q07",
	"SM_Q08",
	"SM_Q09",
	"SM_Q10",
	"SM_Q11",
] as const;

export type SupermarketQuestionId = (typeof SUPERMARKET_QUESTION_IDS)[number];

export type UiScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[answerId: string]: UiScoringAnswerTree | string | number | undefined;
};

export type UiScoringQuestionGroup = {
	questions: Array<{
		questionId: SupermarketQuestionId;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: UiScoringAnswerTree;
};

export type UiScoringQuestionGroups = UiScoringQuestionGroup[];

export const SUPERMARKET_TOP_LEVEL_SERVER_FIELDS = {
	SM_Q01: {
		answer: "sm_q01_answer",
		comment: "sm_q01_comment",
	},
	SM_Q05: {
		answer: "sm_q05_answer",
		comment: "sm_q05_comment",
	},
	SM_Q06: {
		answer: "sm_q06_answer",
		comment: "sm_q06_comment",
	},
	SM_Q07: {
		answer: "sm_q07_answer",
		comment: "sm_q07_comment",
	},
	SM_Q08: {
		answer: "sm_q08_answer",
		comment: "sm_q08_comment",
	},
	SM_Q09: {
		answer: "sm_q09_answer",
		comment: "sm_q09_comment",
	},
	SM_Q10: {
		answer: "sm_q10_answer",
		comment: "sm_q10_comment",
	},
	SM_Q11: {
		answer: "sm_q11_answer",
		comment: "sm_q11_comment",
	},
} as const;

export const SUPERMARKET_NESTED_SERVER_FIELDS = {
	SM_Q02: {
		answer: "sm_lvl_q02_answer",
		comment: "sm_lvl_q02_comment",
	},
	SM_Q03: {
		answer: "sm_lvl_q03_answer",
		comment: "sm_lvl_q03_comment",
	},
	SM_Q04: {
		answer: "sm_lvl_q04_answer",
		comment: "sm_lvl_q04_comment",
	},
} as const;

export const SUPERMARKET_UI_SCORING_QUESTION_GROUPS = [
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
			SM1_A01: {
				answerText: "Fully automated with exception workflow",
				SM1_B01: {
					answerText: "Real-time variance reconciliation",
					SM1_C01: {
						answerText: "< 1 hour",
						weight: 0,
						grade: "LowRisk",
					},
					SM1_C02: {
						answerText: "Within same shift",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM1_C03: {
						answerText: "Within 24 hours",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM1_B02: {
					answerText: "Daily end-of-day reconciliation",
					SM1_C04: {
						answerText: "< 4 hours",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM1_C05: {
						answerText: "Same business day",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM1_B03: {
					answerText: "Weekly trend-only reconciliation",
					SM1_C06: {
						answerText: "Next business day",
						weight: 2,
						grade: "MediumRisk",
					},
					SM1_C07: {
						answerText: "Within 48 hours",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
			},
			SM1_A02: {
				answerText: "Semi-automated with manual approvals",
				SM1_B04: {
					answerText: "Daily with supervisor sign-off",
					SM1_C08: {
						answerText: "Same day",
						weight: 2,
						grade: "MediumRisk",
					},
					SM1_C09: {
						answerText: "Next business day",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM1_B05: {
					answerText: "Weekly with manual root-cause review",
					SM1_C10: {
						answerText: "Within 48 hours",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM1_C11: {
						answerText: "> 3 business days",
						weight: 4,
						grade: "HighRisk",
					},
					SM1_C12: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM1_B06: {
					answerText: "Monthly reconciliation only",
					SM1_C13: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM1_C14: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
			SM1_A03: {
				answerText: "Manual process only",
				SM1_B07: {
					answerText: "Ad-hoc spot checks",
					SM1_C15: {
						answerText: "> 3 business days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM1_C16: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM1_B08: {
					answerText: "No formal reconciliation",
					SM1_C17: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM1_C18: {
						answerText: "Incidents not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM1_B09: {
					answerText: "Paper logs reconciled monthly",
					SM1_C19: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM1_C20: {
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
			SM2_A01: {
				answerText: "Continuous IoT monitoring with alerts",
				SM2_B01: {
					answerText: "Daily hygiene audits",
					SM2_C01: {
						answerText: "< 24 hours",
						weight: 0,
						grade: "LowRisk",
					},
					SM2_C02: {
						answerText: "Within 72 hours",
						weight: 1,
						grade: "LowMediumRisk",
					},
				},
				SM2_B02: {
					answerText: "Weekly hygiene audits",
					SM2_C03: {
						answerText: "Within 72 hours",
						weight: 2,
						grade: "MediumRisk",
					},
					SM2_C04: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM2_B03: {
					answerText: "Monthly hygiene audits",
					SM2_C05: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM2_C06: {
						answerText: "> 7 days",
						weight: 4,
						grade: "HighRisk",
					},
				},
			},
			SM2_A02: {
				answerText: "Manual logs twice a day",
				SM2_B04: {
					answerText: "Weekly",
					SM2_C07: {
						answerText: "Within 72 hours",
						weight: 2,
						grade: "MediumRisk",
					},
					SM2_C08: {
						answerText: "Within 7 days",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM2_B05: {
					answerText: "Monthly",
					SM2_C09: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM2_C10: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM2_B06: {
					answerText: "Only after incidents",
					SM2_C11: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM2_C12: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
			},
			SM2_A03: {
				answerText: "No systematic tracking",
				SM2_B07: {
					answerText: "Quarterly",
					SM2_C13: {
						answerText: "> 7 days",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM2_C14: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM2_B08: {
					answerText: "Never",
					SM2_C15: {
						answerText: "Not tracked",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM2_C16: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM2_B09: {
					answerText: "Paper logbooks only",
					SM2_C17: {
						answerText: "Within 7 days",
						weight: 4,
						grade: "HighRisk",
					},
					SM2_C18: {
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
			SM3_A01: {
				answerText: "Real-time fraud engine",
				SM3_B01: {
					answerText: "Role-based with quarterly recertification",
					SM3_C01: {
						answerText: "Quarterly",
						weight: 0,
						grade: "LowRisk",
					},
					SM3_C02: {
						answerText: "Bi-annually",
						weight: 1,
						grade: "LowMediumRisk",
					},
				},
				SM3_B02: {
					answerText: "Role-based with annual recertification",
					SM3_C03: {
						answerText: "Bi-annually",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM3_C04: {
						answerText: "Ad-hoc",
						weight: 2,
						grade: "MediumRisk",
					},
				},
				SM3_B03: {
					answerText: "Automated approvals with break-glass access",
					SM3_C05: {
						answerText: "Quarterly",
						weight: 1,
						grade: "LowMediumRisk",
					},
					SM3_C06: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
			},
			SM3_A02: {
				answerText: "Rule-based checks only",
				SM3_B04: {
					answerText: "Shared credentials still exist",
					SM3_C07: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM3_C08: {
						answerText: "Never",
						weight: 4,
						grade: "HighRisk",
					},
				},
				SM3_B05: {
					answerText: "Role-based, annual recertification",
					SM3_C09: {
						answerText: "Bi-annually",
						weight: 2,
						grade: "MediumRisk",
					},
					SM3_C10: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
				},
				SM3_B06: {
					answerText: "Privileged access via ticket queue only",
					SM3_C11: {
						answerText: "Ad-hoc",
						weight: 3,
						grade: "MediumHighRisk",
					},
					SM3_C12: {
						answerText: "Never",
						weight: 4,
						grade: "HighRisk",
					},
				},
			},
			SM3_A03: {
				answerText: "No dedicated fraud controls",
				SM3_B07: {
					answerText: "Shared credentials common",
					SM3_C13: {
						answerText: "Never",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM3_C14: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
				},
				SM3_B08: {
					answerText: "No access governance",
					SM3_C15: {
						answerText: "Not defined",
						weight: 5,
						grade: "HighRisk_Trigger",
					},
					SM3_C16: {
						answerText: "Ad-hoc",
						weight: 4,
						grade: "HighRisk",
					},
				},
				SM3_B09: {
					answerText: "Manual access lists, no approvals",
					SM3_C17: {
						answerText: "Ad-hoc",
						weight: 4,
						grade: "HighRisk",
					},
					SM3_C18: {
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
			SM4_A01: {
				answerText: "> 98% completion",
				SM4_B01: {
					answerText: "Measured weekly with targets",
					weight: 0,
					grade: "LowRisk",
				},
				SM4_B02: {
					answerText: "Measured monthly",
					weight: 1,
					grade: "LowMediumRisk",
				},
				SM4_B03: {
					answerText: "Measured quarterly",
					weight: 2,
					grade: "MediumRisk",
				},
			},
			SM4_A02: {
				answerText: "85%-98% completion",
				SM4_B04: {
					answerText: "Measured monthly",
					weight: 2,
					grade: "MediumRisk",
				},
				SM4_B05: {
					answerText: "Tracked but no target",
					weight: 3,
					grade: "MediumHighRisk",
				},
				SM4_B06: {
					answerText: "Tracked quarterly",
					weight: 4,
					grade: "HighRisk",
				},
			},
			SM4_A03: {
				answerText: "< 85% completion",
				SM4_B07: {
					answerText: "Not tracked",
					weight: 5,
					grade: "HighRisk_Trigger",
				},
				SM4_B08: {
					answerText: "Tracked quarterly",
					weight: 4,
					grade: "HighRisk",
				},
				SM4_B09: {
					answerText: "Measured yearly only",
					weight: 5,
					grade: "HighRisk_Trigger",
				},
			},
		},
	},
] satisfies UiScoringQuestionGroups;
