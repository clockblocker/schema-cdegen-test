import { useController, useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { AudutFormValues, AudutQuestionGroup } from "./types";
import { useQuestionOptions } from "./use-question-options";

export function QuestionField({
	group,
	questionIndex,
}: {
	group: AudutQuestionGroup;
	questionIndex: number;
}) {
	const groupId = String(group.groupId);
	const questionId = group.questionIds[questionIndex] ?? "";
	const fieldName =
		`groups.${groupId}.${questionId}` as `groups.${string}.${string}`;

	const commentFieldName =
		`groups.${groupId}.${questionId}_comment` as `groups.${string}.${string}`;

	const { resetField } = useFormContext<AudutFormValues>();
	const { field } = useController<AudutFormValues, typeof fieldName>({
		name: fieldName,
	});
	const { field: commentField } = useController<
		AudutFormValues,
		typeof commentFieldName
	>({
		name: commentFieldName,
	});
	const options = useQuestionOptions(group, questionIndex);

	if (!questionId) return null;

	const disabled = questionIndex > 0 && options.length === 0;

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
			<Select
				disabled={disabled}
				onValueChange={handleChange}
				value={field.value ?? ""}
			>
				<SelectTrigger disabled={disabled}>
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
			<input
				className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				onChange={commentField.onChange}
				placeholder="Add a comment..."
				type="text"
				value={commentField.value ?? ""}
			/>
		</div>
	);
}
