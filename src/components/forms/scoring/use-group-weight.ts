import { useWatch } from "react-hook-form";
import type { ScoringFormValues, ScoringQuestionGroup } from "./types";

export function useGroupWeight(group: ScoringQuestionGroup): number | null {
	const groupId = String(group.groupId);
	const groupValues = useWatch<ScoringFormValues, `groups.${string}`>({
		name: `groups.${groupId}`,
	});

	const allAnswered = group.questionIds.every(
		(qId) => groupValues?.[qId] !== undefined,
	);
	if (!allAnswered) return null;

	let sum = 0;
	let currentAnswers = group.answersTree;

	for (const qId of group.questionIds) {
		const selectedId = groupValues?.[qId];
		const selected = currentAnswers.find((a) => a.id === selectedId);
		if (!selected) return null;
		sum += selected.weight ?? 0;
		currentAnswers = selected.relatedAnswers;
	}

	return sum * (group.groupWeight ?? 1);
}
