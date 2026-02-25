import { getSelectedPathNodes } from "./tree-traversal";
import type {
	GroupEvaluation,
	QuestionnaireAnswerMap,
	UiScoringQuestionGroup,
} from "./types";

export function evaluateQuestionGroup<QuestionId extends string>(
	group: UiScoringQuestionGroup<QuestionId>,
	answers: QuestionnaireAnswerMap<QuestionId> | undefined,
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
