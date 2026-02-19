import { useWatch } from "react-hook-form";
import type { AnswerScore, AudutFormValues, AudutQuestionGroup } from "./types";

export function useQuestionOptions(
	group: AudutQuestionGroup,
	questionIndex: number,
): AnswerScore[] {
	const groupId = String(group.groupId);
	const groupValues = useWatch<AudutFormValues, `groups.${string}`>({
		name: `groups.${groupId}`,
	});

	if (questionIndex === 0) return group.answersTree;

	let currentAnswers = group.answersTree;
	for (let i = 0; i < questionIndex; i++) {
		const qId = group.questionIds[i];
		if (!qId) return [];
		const selectedId = groupValues?.[qId];
		if (!selectedId) return [];
		const selected = currentAnswers.find((a) => a.id === selectedId);
		if (!selected) return [];
		currentAnswers = selected.relatedAnswers;
	}
	return currentAnswers;
}
