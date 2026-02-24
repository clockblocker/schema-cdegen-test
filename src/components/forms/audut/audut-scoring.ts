import type { AnswerScore, AudutQuestionGroup, GroupFormValues } from "./types";

type AudutTraversal = {
	selectedAnswers: AnswerScore[];
	nextAnswers: AnswerScore[];
};

function traverseAudutAnswers(
	group: AudutQuestionGroup,
	groupValues: GroupFormValues | undefined,
	depth: number,
): AudutTraversal | null {
	let nextAnswers = group.answersTree;
	const selectedAnswers: AnswerScore[] = [];

	for (let index = 0; index < depth; index++) {
		const questionId = group.questionIds[index];
		if (!questionId) {
			return null;
		}

		const selectedId = groupValues?.[questionId];
		if (!selectedId) {
			return null;
		}

		const selectedAnswer = nextAnswers.find(
			(answer) => answer.id === selectedId,
		);
		if (!selectedAnswer) {
			return null;
		}

		selectedAnswers.push(selectedAnswer);
		nextAnswers = selectedAnswer.relatedAnswers;
	}

	return {
		selectedAnswers,
		nextAnswers,
	};
}

export function getAudutQuestionOptions(
	group: AudutQuestionGroup,
	groupValues: GroupFormValues | undefined,
	questionIndex: number,
): AnswerScore[] {
	if (questionIndex === 0) {
		return group.answersTree;
	}

	const traversal = traverseAudutAnswers(group, groupValues, questionIndex);
	return traversal?.nextAnswers ?? [];
}

export function evaluateAudutGroup(
	group: AudutQuestionGroup,
	groupValues: GroupFormValues | undefined,
): number | null {
	const traversal = traverseAudutAnswers(
		group,
		groupValues,
		group.questionIds.length,
	);
	if (!traversal) {
		return null;
	}

	const rawScore = traversal.selectedAnswers.reduce(
		(total, answer) => total + (answer.weight ?? 0),
		0,
	);

	return rawScore * (group.groupWeight ?? 1);
}
