import type { UiScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import {
	buildUiScoringQuestionGroups,
	type RawScoringQuestionGroup,
} from "~/consumer-code/questionnaire-factory";
import type { QuestionnaireQuestionId } from "~/lib/questionnaire-id-types";

export const LIBRARY_QUESTION_IDS = [
	"LIB_Q01",
	"LIB_Q02",
] as const satisfies readonly QuestionnaireQuestionId<"LIB">[];

export type LibraryQuestionId = (typeof LIBRARY_QUESTION_IDS)[number];

export function buildLibraryQuestionGroups(
	serverGroups: RawScoringQuestionGroup<string>[],
): UiScoringQuestionGroups<LibraryQuestionId> {
	return buildUiScoringQuestionGroups(LIBRARY_QUESTION_IDS, serverGroups);
}
