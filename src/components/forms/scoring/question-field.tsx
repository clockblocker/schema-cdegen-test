import { useController, useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { ScoringFormValues, ScoringQuestionGroup } from "./types";
import { useQuestionOptions } from "./use-question-options";

export function QuestionField({
	group,
	questionIndex,
}: {
	group: ScoringQuestionGroup;
	questionIndex: number;
}) {
	const groupId = String(group.groupId);
	const questionId = group.questionIds[questionIndex] ?? "";
	const fieldName =
		`groups.${groupId}.${questionId}` as `groups.${string}.${string}`;

	const { resetField } = useFormContext<ScoringFormValues>();
	const { field } = useController<ScoringFormValues, typeof fieldName>({
		name: fieldName,
	});
	const options = useQuestionOptions(group, questionIndex);

	if (!questionId || (questionIndex > 0 && options.length === 0)) return null;

	const handleChange = (value: string) => {
		field.onChange(value);
		for (const qId of group.questionIds.slice(questionIndex + 1)) {
			resetField(`groups.${groupId}.${qId}` as `groups.${string}.${string}`, {
				defaultValue: undefined,
			});
		}
	};

	return (
		<div className="flex flex-col gap-1.5">
			<Label>Question {questionIndex + 1}</Label>
			<Select onValueChange={handleChange} value={field.value ?? ""}>
				<SelectTrigger>
					<SelectValue placeholder="Select an answer..." />
				</SelectTrigger>
				<SelectContent>
					{options.map((a) => (
						<SelectItem key={a.id} value={a.id ?? ""}>
							{a.grade}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
