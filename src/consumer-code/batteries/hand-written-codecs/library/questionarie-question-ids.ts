import type { QuestionnaireQuestionId } from "~/lib/questionnaire-id-types";

export const LIBRARY_QUESTION_IDS = [
	"LIB_Q01",
	"LIB_Q02",
] as const satisfies readonly QuestionnaireQuestionId<"LIB">[];

export type LibraryQuestionId = (typeof LIBRARY_QUESTION_IDS)[number];
