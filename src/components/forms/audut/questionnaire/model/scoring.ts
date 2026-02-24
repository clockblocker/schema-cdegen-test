import type { UiScoringQuestionGroup } from "~/consumer-code/supermarket/questionnaire-config";
import { getSelectedPathNodes } from "./tree-traversal";
import type { GroupEvaluation, QuestionnaireAnswerMap } from "./types";

type GroupQuestionId = UiScoringQuestionGroup["questions"][number]["questionId"];

export function evaluateQuestionGroup(
	group: UiScoringQuestionGroup,
	answers: QuestionnaireAnswerMap<GroupQuestionId> | undefined,
): GroupEvaluation | null {
	const selectedNodes = getSelectedPathNodes(
		group,
		answers,
		group.questions.length,
	);
	if (!selectedNodes) {
		return null;
	}

	const score = selectedNodes.reduce(
		(total, node) => total + (node.weight ?? 0),
		0,
	);
	const currentGrade = selectedNodes[selectedNodes.length - 1]?.grade;

	return {
		weightedScore: score * group.groupWeight,
		grade: currentGrade,
	};
}
