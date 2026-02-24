import { Controller, type FieldErrors, useFormContext } from "react-hook-form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { UiScoringQuestionGroup } from "~/consumer-code/supermarket/questionnaire-config";
import { getAnswerErrorMessage } from "./form-errors";
import { getQuestionOptions } from "./tree-model";
import type { SupermarketAnswers, SupermarketAudit } from "./types";

type QuestionnaireRowProps = {
	group: UiScoringQuestionGroup;
	questionIndex: number;
	questionnaireAnswers: Partial<SupermarketAnswers> | undefined;
	errors: FieldErrors<SupermarketAudit>;
};

export function QuestionnaireQuestionRow({
	group,
	questionIndex,
	questionnaireAnswers,
	errors,
}: QuestionnaireRowProps) {
	const { control, register, setValue } = useFormContext<SupermarketAudit>();
	const question = group.questions[questionIndex];
	if (!question) {
		return null;
	}

	const options = getQuestionOptions(
		group,
		questionIndex,
		questionnaireAnswers,
	);
	const disabled = questionIndex > 0 && options.length === 0;
	const answerFieldName =
		`questionare.answers.${question.questionId}.answer` as const;
	const commentFieldName =
		`questionare.answers.${question.questionId}.comment` as const;
	const answerError = getAnswerErrorMessage(errors, question.questionId);

	return (
		<div className="flex flex-col gap-2">
			<Label>{question.questionText}</Label>
			<Controller
				control={control}
				name={answerFieldName}
				render={({ field }) => (
					<Select
						disabled={disabled}
						onValueChange={(value) => {
							field.onChange(value);
							for (const nextQuestion of group.questions.slice(
								questionIndex + 1,
							)) {
								setValue(
									`questionare.answers.${nextQuestion.questionId}.answer`,
									null,
									{ shouldDirty: true, shouldValidate: true },
								);
								setValue(
									`questionare.answers.${nextQuestion.questionId}.comment`,
									"",
									{ shouldDirty: true },
								);
							}
						}}
						value={field.value ?? ""}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select an answer..." />
						</SelectTrigger>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.answerId} value={option.answerId}>
									{option.node.answerText}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>
			{answerError && <p className="text-destructive text-sm">{answerError}</p>}
			<input
				{...register(commentFieldName)}
				className="rounded border px-3 py-2"
				placeholder="Comment"
				type="text"
			/>
		</div>
	);
}
