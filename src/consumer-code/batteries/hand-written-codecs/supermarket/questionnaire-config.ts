import type { UiScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import { buildUiScoringQuestionGroups } from "~/consumer-code/questionnaire-factory";
import type { QuestionnaireQuestionId } from "~/lib/questionnaire-id-types";
import { SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS } from "../../generated/supermarket/server-scoring-question-groups";

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

export const SUPERMARKET_UI_SCORING_QUESTION_GROUPS: UiScoringQuestionGroups<SupermarketQuestionId> =
	buildUiScoringQuestionGroups(
		SUPERMARKET_QUESTION_IDS,
		SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS,
	);
