import type { ParsedScoringQuestionGroup } from "./types";

export function getFieldsToClearOnChange<QuestionId extends string>(
	group: ParsedScoringQuestionGroup<QuestionId>,
	questionIndex: number,
): QuestionId[] {
	return group.questions
		.slice(questionIndex + 1)
		.map((question) => question.questionId);
}
