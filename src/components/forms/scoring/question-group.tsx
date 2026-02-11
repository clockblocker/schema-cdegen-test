import { QuestionField } from "./question-field";
import type { ScoringQuestionGroup } from "./types";
import { useGroupWeight } from "./use-group-weight";

export function QuestionGroup({ group }: { group: ScoringQuestionGroup }) {
	const weight = useGroupWeight(group);

	return (
		<fieldset className="flex flex-col gap-4 rounded-lg border p-4">
			<div className="flex items-center justify-between">
				<legend className="font-semibold text-sm">Group {group.groupId}</legend>
				{weight !== null && (
					<span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground text-xs">
						Weight: {weight}
					</span>
				)}
			</div>
			{group.questionIds.map((_, index) => (
				<QuestionField
					group={group}
					key={group.questionIds[index]}
					questionIndex={index}
				/>
			))}
		</fieldset>
	);
}
