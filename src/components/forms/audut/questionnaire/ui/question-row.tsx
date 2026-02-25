import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { getQuestionOptions } from "../model/tree-traversal";
import type {
	QuestionnaireFormApi,
	ScoringQuestionGroup,
} from "../model/types";

type QuestionnaireRowProps<QuestionId extends string> = {
	formApi: QuestionnaireFormApi<QuestionId>;
	group: ScoringQuestionGroup<QuestionId>;
	questionIndex: number;
};

export function QuestionnaireQuestionRow<QuestionId extends string>({
	formApi,
	group,
	questionIndex,
}: QuestionnaireRowProps<QuestionId>) {
	const question = group.questions[questionIndex];
	if (!question) {
		return null;
	}

	const options = getQuestionOptions(
		group,
		questionIndex,
		formApi.questionnaireAnswers,
	);
	const disabled = questionIndex > 0 && options.length === 0;
	const selectedAnswer =
		formApi.questionnaireAnswers?.[question.questionId]?.answer;
	const selectedAnswerValue =
		typeof selectedAnswer === "string" ? selectedAnswer : "";
	const answerError = formApi.getAnswerError(question.questionId);
	const allowedAnswerIds = new Set<string>(
		options.map((option) => option.answerId),
	);

	return (
		<div className="flex flex-col gap-2">
			<Label>{question.questionText}</Label>
			<Select
				disabled={disabled}
				onValueChange={(value) => {
					if (!allowedAnswerIds.has(value)) {
						return;
					}
					formApi.setAnswer(question.questionId, value);
					formApi.clearDownstream(group, questionIndex);
				}}
				value={selectedAnswerValue}
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
			{answerError && <p className="text-destructive text-sm">{answerError}</p>}
			<input
				{...formApi.registerComment(question.questionId)}
				className="rounded border px-3 py-2"
				placeholder="Comment"
				type="text"
			/>
		</div>
	);
}
