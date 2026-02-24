import type { UiScoringQuestionGroup } from "~/consumer-code/supermarket/questionnaire-config";

export function getFieldsToClearOnChange(
	group: UiScoringQuestionGroup,
	questionIndex: number,
): Array<UiScoringQuestionGroup["questions"][number]["questionId"]> {
	return group.questions
		.slice(questionIndex + 1)
		.map((question) => question.questionId);
}
