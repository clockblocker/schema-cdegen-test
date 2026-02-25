import type { UiScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import { buildUiScoringQuestionGroups } from "~/consumer-code/questionnaire-factory";
import type { QuestionnaireQuestionId } from "~/lib/questionnaire-id-types";
import { LIBRARY_SERVER_SCORING_QUESTION_GROUPS } from "../../generated/library/server-scoring-question-groups";

export const LIBRARY_QUESTION_IDS = [
	"LIB_Q01",
	"LIB_Q02",
] as const satisfies readonly QuestionnaireQuestionId<"LIB">[];

export type LibraryQuestionId = (typeof LIBRARY_QUESTION_IDS)[number];

export const LIBRARY_UI_SCORING_QUESTION_GROUPS: UiScoringQuestionGroups<LibraryQuestionId> =
	buildUiScoringQuestionGroups(
		LIBRARY_QUESTION_IDS,
		LIBRARY_SERVER_SCORING_QUESTION_GROUPS,
	);
