import { getQuestionOptions } from "../../../model/tree-traversal";
import type {
	QuestionnaireFormApi,
	ScoringQuestionGroup,
} from "../../../model/types";
import {
	controlsRow,
	errorText,
	questionBlock,
	questionLabel,
	select,
	textInput,
} from "../../../styles";

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

	const answerRegistration = formApi.registerAnswer(question.questionId);

	const safeValue = allowedAnswerIds.has(selectedAnswerValue)
		? selectedAnswerValue
		: "";

	const selectId = `question-${question.questionId}`;

	return (
		<div className={questionBlock}>
			<label className={questionLabel} htmlFor={selectId}>
				{question.questionText}
			</label>
			<div className={controlsRow}>
				<select
					{...answerRegistration}
					className={select}
					disabled={disabled}
					id={selectId}
					onChange={(event) => {
						const value = event.target.value;
						if (!allowedAnswerIds.has(value)) {
							return;
						}
						formApi.setAnswer(question.questionId, value);
						formApi.clearDownstream(group, questionIndex);
					}}
					value={safeValue}
				>
					<option disabled value="">
						Select an answer...
					</option>
					{options.map((option) => (
						<option key={option.answerId} value={option.answerId}>
							{option.node.answerText}
						</option>
					))}
				</select>
				<input
					{...formApi.registerComment(question.questionId)}
					className={textInput}
					placeholder="Comment"
					type="text"
				/>
			</div>
			{answerError && <p className={errorText}>{answerError}</p>}
		</div>
	);
}
