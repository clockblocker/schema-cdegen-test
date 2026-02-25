import type { FieldValues, Path } from "react-hook-form";
import { answerFieldPath, commentFieldPath } from "../hooks/form-types";
import {
	getQuestionnaireAnswerError,
	useQuestionnaireForm,
} from "../hooks/use-questionnaire-form";
import { getFieldsToClearOnChange } from "../model/cascading-reset";
import { evaluateQuestionGroup } from "../model/scoring";
import type {
	GroupEvaluation,
	QuestionnaireFormApi,
	UiScoringQuestionGroups,
} from "../model/types";
import { QuestionnaireGroupFieldset } from "./question-group-fieldset";

type AuditQuestionnaireFormProps<QuestionId extends string> = {
	questionGroups: UiScoringQuestionGroups<QuestionId>;
};

export function AuditQuestionnaireForm<QuestionId extends string>({
	questionGroups,
}: AuditQuestionnaireFormProps<QuestionId>) {
	const { errors, questionnaireAnswers, register, setValue } =
		useQuestionnaireForm<FieldValues, QuestionId>();

	const setFormValue = (
		path: Path<FieldValues>,
		value: unknown,
		options?: { shouldDirty?: boolean; shouldValidate?: boolean },
	) => {
		// RHF escape hatch: runtime paths are valid, but TS cannot prove the value-path coupling here.
		(
			setValue as (
				field: Path<FieldValues>,
				fieldValue: unknown,
				fieldOptions?: { shouldDirty?: boolean; shouldValidate?: boolean },
			) => void
		)(path, value, options);
	};

	const setAnswer: QuestionnaireFormApi<QuestionId>["setAnswer"] = (
		questionId,
		answerId,
	) => {
		const answerPath = answerFieldPath(questionId) as Path<FieldValues>;
		setFormValue(answerPath, answerId, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const setComment = (questionId: QuestionId, comment: string) => {
		const commentPath = commentFieldPath(questionId) as Path<FieldValues>;
		setFormValue(commentPath, comment, {
			shouldDirty: true,
		});
	};

	const formApi: QuestionnaireFormApi<QuestionId> = {
		questionnaireAnswers,
		setAnswer,
		clearDownstream: (group, questionIndex) => {
			for (const questionId of getFieldsToClearOnChange(group, questionIndex)) {
				setAnswer(questionId, null);
				setComment(questionId, "");
			}
		},
		getAnswerError: (questionId) =>
			getQuestionnaireAnswerError(errors, questionId),
		registerComment: (questionId) =>
			register(commentFieldPath(questionId) as Path<FieldValues>),
	};

	const groupEvaluations = questionGroups.map((group) =>
		evaluateQuestionGroup(group, questionnaireAnswers),
	);
	const totalScore = groupEvaluations.reduce(
		(total, evaluation) => total + (evaluation?.weightedScore ?? 0),
		0,
	);
	const hasAnyEvaluation = groupEvaluations.some(
		(evaluation): evaluation is GroupEvaluation => Boolean(evaluation),
	);

	return (
		<div className="flex flex-col gap-6">
			<h3 className="font-semibold text-base">Questionnaire</h3>
			{questionGroups.map((group, groupIndex) => (
				<QuestionnaireGroupFieldset<QuestionId>
					evaluation={groupEvaluations[groupIndex] ?? null}
					formApi={formApi}
					group={group}
					groupIndex={groupIndex}
					key={`group-${groupIndex + 1}`}
				/>
			))}

			{hasAnyEvaluation && (
				<div className="rounded-lg border border-dashed p-4 text-center font-semibold text-sm">
					Total Score: {totalScore}
				</div>
			)}
		</div>
	);
}
