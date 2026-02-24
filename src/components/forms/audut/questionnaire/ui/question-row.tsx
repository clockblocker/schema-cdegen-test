import { Controller } from "react-hook-form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { UiScoringQuestionGroup } from "~/consumer-code/supermarket/questionnaire-config";
import { answerFieldPath, commentFieldPath } from "../hooks/form-types";
import {
	getAnswerErrorMessage,
	useQuestionnaireForm,
} from "../hooks/use-questionnaire-form";
import { getFieldsToClearOnChange } from "../model/cascading-reset";
import { getQuestionOptions } from "../model/tree-traversal";

type QuestionnaireRowProps = {
	group: UiScoringQuestionGroup;
	questionIndex: number;
};

export function QuestionnaireQuestionRow({
	group,
	questionIndex,
}: QuestionnaireRowProps) {
	const { control, errors, questionnaireAnswers, register, setValue } =
		useQuestionnaireForm();
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
	const answerFieldName = answerFieldPath(question.questionId);
	const commentFieldName = commentFieldPath(question.questionId);
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

							for (const questionId of getFieldsToClearOnChange(
								group,
								questionIndex,
							)) {
								setValue(answerFieldPath(questionId), null, {
									shouldDirty: true,
									shouldValidate: true,
								});
								setValue(commentFieldPath(questionId), "", {
									shouldDirty: true,
								});
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
