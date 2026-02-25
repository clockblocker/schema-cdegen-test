import type { UiScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import { SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS } from "~/consumer-code/batteries/generated/supermarket/server-scoring-question-groups";
import { buildUiScoringQuestionGroups } from "~/consumer-code/questionnaire-factory";
import type {
	QuestionnaireAnswerIdForQuestion,
	QuestionnaireQuestionId,
} from "~/lib/questionnaire-id-types";

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
] as const satisfies readonly QuestionnaireQuestionId<"SM">[];

export type SupermarketQuestionId = (typeof SUPERMARKET_QUESTION_IDS)[number];
export type SupermarketAnswerId =
	QuestionnaireAnswerIdForQuestion<SupermarketQuestionId>;

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
} as const satisfies Partial<
	Record<SupermarketQuestionId, { answer: string; comment: string }>
>;

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
} as const satisfies Partial<
	Record<SupermarketQuestionId, { answer: string; comment: string }>
>;

export const SUPERMARKET_UI_SCORING_QUESTION_GROUPS: UiScoringQuestionGroups<SupermarketQuestionId> =
	buildUiScoringQuestionGroups(
		SUPERMARKET_QUESTION_IDS,
		SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS,
	);
