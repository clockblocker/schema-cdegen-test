import type {
	UiScoringAnswerTree,
	UiScoringQuestionGroup,
} from "~/consumer-code/supermarket/questionnaire-config";
import type {
	AnswerOption,
	GroupEvaluation,
	SupermarketAnswers,
} from "./types";

const TREE_META_KEYS = new Set(["answerText", "grade", "weight"]);

function isAnswerTreeNode(value: unknown): value is UiScoringAnswerTree {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return typeof (value as { answerText?: unknown }).answerText === "string";
}

function getChildOptions(node: UiScoringAnswerTree): AnswerOption[] {
	const options: AnswerOption[] = [];

	for (const [answerId, value] of Object.entries(node)) {
		if (TREE_META_KEYS.has(answerId) || !isAnswerTreeNode(value)) {
			continue;
		}

		options.push({ answerId, node: value });
	}

	return options;
}

function getSelectedPathNodes(
	group: UiScoringQuestionGroup,
	answers: Partial<SupermarketAnswers> | undefined,
	depth: number,
): UiScoringAnswerTree[] | null {
	let currentNode: UiScoringAnswerTree = group.answersTree;
	const selectedNodes: UiScoringAnswerTree[] = [];

	for (let index = 0; index < depth; index++) {
		const question = group.questions[index];
		if (!question) {
			return null;
		}

		const selectedAnswerId = answers?.[question.questionId]?.answer;
		if (!selectedAnswerId) {
			return null;
		}

		const nextNode = currentNode[selectedAnswerId];
		if (!isAnswerTreeNode(nextNode)) {
			return null;
		}

		selectedNodes.push(nextNode);
		currentNode = nextNode;
	}

	return selectedNodes;
}

export function getQuestionOptions(
	group: UiScoringQuestionGroup,
	questionIndex: number,
	answers: Partial<SupermarketAnswers> | undefined,
): AnswerOption[] {
	if (questionIndex === 0) {
		return getChildOptions(group.answersTree);
	}

	const selectedNodes = getSelectedPathNodes(group, answers, questionIndex);
	const currentNode = selectedNodes?.at(-1);
	if (!currentNode) {
		return [];
	}

	return getChildOptions(currentNode);
}

export function evaluateQuestionGroup(
	group: UiScoringQuestionGroup,
	answers: Partial<SupermarketAnswers> | undefined,
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
