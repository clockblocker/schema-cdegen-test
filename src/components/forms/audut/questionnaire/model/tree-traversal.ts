import type { QuestionnaireAnswerIdForQuestion } from "~/lib/questionnaire-id-types";
import type {
	AnswerOption,
	QuestionnaireAnswerMap,
	UiScoringAnswerTree,
	UiScoringQuestionGroup,
} from "./types";

const TREE_META_KEYS = new Set(["answerText", "grade", "weight"]);

function isAnswerTreeNode(value: unknown): value is UiScoringAnswerTree {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return typeof (value as { answerText?: unknown }).answerText === "string";
}

export function getChildOptions<AnswerId extends string>(
	node: UiScoringAnswerTree,
): AnswerOption<AnswerId>[] {
	const options: AnswerOption<AnswerId>[] = [];

	for (const [answerId, value] of Object.entries(node)) {
		if (TREE_META_KEYS.has(answerId) || !isAnswerTreeNode(value)) {
			continue;
		}

		options.push({ answerId: answerId as AnswerId, node: value });
	}

	return options;
}

export function getSelectedPathNodes<QuestionId extends string>(
	group: UiScoringQuestionGroup<QuestionId>,
	answers: QuestionnaireAnswerMap<QuestionId> | undefined,
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

		const nextNode = (currentNode as Record<string, unknown>)[selectedAnswerId];
		if (!isAnswerTreeNode(nextNode)) {
			return null;
		}

		selectedNodes.push(nextNode);
		currentNode = nextNode;
	}

	return selectedNodes;
}

export function getQuestionOptions<QuestionId extends string>(
	group: UiScoringQuestionGroup<QuestionId>,
	questionIndex: number,
	answers: QuestionnaireAnswerMap<QuestionId> | undefined,
): AnswerOption<QuestionnaireAnswerIdForQuestion<QuestionId>>[] {
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
