import { useWatch } from "react-hook-form";
import { getAudutQuestionOptions } from "./audut-scoring";
import type { AnswerScore, AudutFormValues, AudutQuestionGroup } from "./types";

export function useQuestionOptions(
	group: AudutQuestionGroup,
	questionIndex: number,
): AnswerScore[] {
	const groupId = String(group.groupId);
	const groupValues = useWatch<AudutFormValues, `groups.${string}`>({
		name: `groups.${groupId}`,
	});

	return getAudutQuestionOptions(group, groupValues, questionIndex);
}
