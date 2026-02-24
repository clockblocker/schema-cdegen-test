import { useWatch } from "react-hook-form";
import { evaluateAudutGroup } from "./audut-scoring";
import type { AudutFormValues, AudutQuestionGroup } from "./types";

export function useGroupWeight(group: AudutQuestionGroup): number | null {
	const groupId = String(group.groupId);
	const groupValues = useWatch<AudutFormValues, `groups.${string}`>({
		name: `groups.${groupId}`,
	});

	return evaluateAudutGroup(group, groupValues);
}
