import type { ScoringQuestionGroup } from "./types";

export function getFieldsToClearOnChange<QuestionId extends string>(
	group: ScoringQuestionGroup<QuestionId>,
	questionIndex: number,
): QuestionId[] {
	return group.questions
		.slice(questionIndex + 1)
		.map((question) => question.questionId);
}
