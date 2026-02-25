import type { UiScoringQuestionGroup } from "./types";

export function getFieldsToClearOnChange<QuestionId extends string>(
	group: UiScoringQuestionGroup<QuestionId>,
	questionIndex: number,
): QuestionId[] {
	return group.questions
		.slice(questionIndex + 1)
		.map((question) => question.questionId);
}
