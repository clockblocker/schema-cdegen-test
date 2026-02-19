import type { AudutQuestionGroup } from "./types";

export const mockAudutGroups: AudutQuestionGroup[] = [
	{
		groupId: 1,
		groupWeight: 2,
		questionIds: ["risk_type", "risk_level", "risk_action"],
		answersTree: [
			{
				id: "credit",
				grade: "Credit Risk",
				weight: 3,
				relatedAnswers: [
					{
						id: "credit_high",
						grade: "High",
						weight: 5,
						relatedAnswers: [
							{
								id: "credit_high_mitigate",
								grade: "Mitigate",
								weight: 2,
								relatedAnswers: [],
							},
							{
								id: "credit_high_accept",
								grade: "Accept",
								weight: 4,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "credit_medium",
						grade: "Medium",
						weight: 3,
						relatedAnswers: [
							{
								id: "credit_med_mitigate",
								grade: "Mitigate",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "credit_med_monitor",
								grade: "Monitor",
								weight: 2,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "credit_low",
						grade: "Low",
						weight: 1,
						relatedAnswers: [
							{
								id: "credit_low_accept",
								grade: "Accept",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "credit_low_ignore",
								grade: "Ignore",
								weight: 0,
								relatedAnswers: [],
							},
						],
					},
				],
			},
			{
				id: "market",
				grade: "Market Risk",
				weight: 4,
				relatedAnswers: [
					{
						id: "market_high",
						grade: "High",
						weight: 5,
						relatedAnswers: [
							{
								id: "market_high_hedge",
								grade: "Hedge",
								weight: 3,
								relatedAnswers: [],
							},
							{
								id: "market_high_exit",
								grade: "Exit",
								weight: 5,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "market_medium",
						grade: "Medium",
						weight: 3,
						relatedAnswers: [
							{
								id: "market_med_hedge",
								grade: "Hedge",
								weight: 2,
								relatedAnswers: [],
							},
							{
								id: "market_med_hold",
								grade: "Hold",
								weight: 1,
								relatedAnswers: [],
							},
						],
					},
				],
			},
			{
				id: "operational",
				grade: "Operational Risk",
				weight: 2,
				relatedAnswers: [
					{
						id: "ops_high",
						grade: "High",
						weight: 4,
						relatedAnswers: [
							{
								id: "ops_high_automate",
								grade: "Automate",
								weight: 3,
								relatedAnswers: [],
							},
							{
								id: "ops_high_outsource",
								grade: "Outsource",
								weight: 2,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "ops_low",
						grade: "Low",
						weight: 1,
						relatedAnswers: [
							{
								id: "ops_low_monitor",
								grade: "Monitor",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "ops_low_accept",
								grade: "Accept",
								weight: 0,
								relatedAnswers: [],
							},
						],
					},
				],
			},
		],
	},
	{
		groupId: 2,
		groupWeight: 3,
		questionIds: ["region", "regulation", "compliance_status"],
		answersTree: [
			{
				id: "eu",
				grade: "EU",
				weight: 4,
				relatedAnswers: [
					{
						id: "eu_gdpr",
						grade: "GDPR",
						weight: 5,
						relatedAnswers: [
							{
								id: "eu_gdpr_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "eu_gdpr_partial",
								grade: "Partial",
								weight: 3,
								relatedAnswers: [],
							},
							{
								id: "eu_gdpr_non",
								grade: "Non-compliant",
								weight: 5,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "eu_mifid",
						grade: "MiFID II",
						weight: 4,
						relatedAnswers: [
							{
								id: "eu_mifid_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "eu_mifid_partial",
								grade: "Partial",
								weight: 3,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "eu_aml",
						grade: "AML Directive",
						weight: 3,
						relatedAnswers: [
							{
								id: "eu_aml_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "eu_aml_non",
								grade: "Non-compliant",
								weight: 4,
								relatedAnswers: [],
							},
						],
					},
				],
			},
			{
				id: "us",
				grade: "US",
				weight: 3,
				relatedAnswers: [
					{
						id: "us_sox",
						grade: "SOX",
						weight: 4,
						relatedAnswers: [
							{
								id: "us_sox_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "us_sox_non",
								grade: "Non-compliant",
								weight: 5,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "us_dodd",
						grade: "Dodd-Frank",
						weight: 3,
						relatedAnswers: [
							{
								id: "us_dodd_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "us_dodd_partial",
								grade: "Partial",
								weight: 3,
								relatedAnswers: [],
							},
						],
					},
				],
			},
			{
				id: "apac",
				grade: "APAC",
				weight: 2,
				relatedAnswers: [
					{
						id: "apac_pdp",
						grade: "PDP Act",
						weight: 3,
						relatedAnswers: [
							{
								id: "apac_pdp_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "apac_pdp_non",
								grade: "Non-compliant",
								weight: 4,
								relatedAnswers: [],
							},
						],
					},
					{
						id: "apac_cbr",
						grade: "CBR Rules",
						weight: 2,
						relatedAnswers: [
							{
								id: "apac_cbr_compliant",
								grade: "Compliant",
								weight: 1,
								relatedAnswers: [],
							},
							{
								id: "apac_cbr_partial",
								grade: "Partial",
								weight: 2,
								relatedAnswers: [],
							},
							{
								id: "apac_cbr_non",
								grade: "Non-compliant",
								weight: 4,
								relatedAnswers: [],
							},
						],
					},
				],
			},
		],
	},
];
