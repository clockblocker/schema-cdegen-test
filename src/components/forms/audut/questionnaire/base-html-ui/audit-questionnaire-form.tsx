import type { Path } from "react-hook-form";
import {
	getQuestionnaireAnswerError,
	useQuestionnaireForm,
} from "~/components/forms/audut/questionnaire/hooks/use-questionnaire-form";
import type { AudutFormDraft } from "~/consumer-code/batteries/batteries-types";
import type { AuditableBuildingKind } from "~/consumer-code/business-types";
import type { ScoringQuestionGroupsFor } from "~/consumer-code/questionnaire-factory";
import { answerFieldPath, commentFieldPath } from "../hooks/form-types";
import { getFieldsToClearOnChange } from "../model/cascading-reset";
import { evaluateQuestionGroup } from "../model/scoring";
import type { GroupEvaluation, QuestionnaireFormApi } from "../model/types";
import { QuestionnaireGroupFieldset } from "./question-group-fieldset";
import { formRoot, title, totalScore as totalScoreBox } from "./styles";

type QuestionIdForAuditKind<AuditKind extends AuditableBuildingKind> =
	ScoringQuestionGroupsFor<AuditKind>[number]["questions"][number]["questionId"];

type AuditQuestionnaireFormProps<AuditKind extends AuditableBuildingKind> = {
	questionGroups: ScoringQuestionGroupsFor<AuditKind>;
};

export function AuditQuestionnaireForm<
	AuditKind extends AuditableBuildingKind,
>({ questionGroups }: AuditQuestionnaireFormProps<AuditKind>) {
	type FormValues = AudutFormDraft<AuditKind>;
	type QuestionId = QuestionIdForAuditKind<AuditKind>;

	const { errors, questionnaireAnswers, register, setValue } =
		useQuestionnaireForm<FormValues, QuestionId>();

	const setFormValue = (
		path: Path<FormValues>,
		value: unknown,
		options?: { shouldDirty?: boolean; shouldValidate?: boolean },
	) => {
		// RHF escape hatch: path-value pairing is valid at runtime but opaque to TS in generic unions.
		(
			setValue as (
				field: Path<FormValues>,
				fieldValue: unknown,
				fieldOptions?: { shouldDirty?: boolean; shouldValidate?: boolean },
			) => void
		)(path, value, options);
	};

	const setAnswer: QuestionnaireFormApi<QuestionId>["setAnswer"] = (
		questionId,
		answerId,
	) => {
		setFormValue(answerFieldPath(questionId) as Path<FormValues>, answerId, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	const setComment = (questionId: QuestionId, comment: string) => {
		setFormValue(commentFieldPath(questionId) as Path<FormValues>, comment, {
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
		registerAnswer: (questionId) =>
			register(answerFieldPath(questionId) as Path<FormValues>),
		registerComment: (questionId) =>
			register(commentFieldPath(questionId) as Path<FormValues>),
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
		<div className={formRoot}>
			<h3 className={title}>Questionnaire</h3>
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
				<div className={totalScoreBox}>Total Score: {totalScore}</div>
			)}
		</div>
	);
}

export {
	AuditQuestionnaireForm as BaseHtmlAuditQuestionnaireForm,
	AuditQuestionnaireForm as BaseHtmlAudutQuestionnaireForm,
};
