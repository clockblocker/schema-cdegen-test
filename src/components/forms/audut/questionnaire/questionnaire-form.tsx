import {
	type FieldErrors,
	type FieldValues,
	type Path,
	useFormContext,
	useWatch,
} from "react-hook-form";
import type { AudutFormDraft } from "~/consumer-code/batteries/batteries-types";
import type { AuditableBuildingKind } from "~/consumer-code/business-types";
import type { ScoringQuestionGroupsFor } from "~/consumer-code/questionnaire-factory";
import { QuestionnaireGroupFieldset } from "./components/group-fieldset/questionnaire-group-fieldset";
import { TotalScoreSection } from "./components/total-score/total-score-section";
import { getSelectedPathNodes } from "./model/tree-traversal";
import type {
	GroupEvaluation,
	QuestionnaireAnswerMap,
	QuestionnaireFormApi,
	ScoringQuestionGroup,
} from "./model/types";
import { formRoot, title } from "./styles";

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

			{hasAnyEvaluation && <TotalScoreSection totalScore={totalScore} />}
		</div>
	);
}

export {
	AuditQuestionnaireForm as AudutQuestionnaireForm,
	AuditQuestionnaireForm as BaseHtmlAuditQuestionnaireForm,
	AuditQuestionnaireForm as BaseHtmlAudutQuestionnaireForm,
	AuditQuestionnaireForm as UiAuditQuestionnaireForm,
	AuditQuestionnaireForm as UiAudutQuestionnaireForm,
};

const QUESTIONNAIRE_ANSWERS_PATH = "questionnaire.answers" as const;

function answerFieldPath<QuestionId extends string>(questionId: QuestionId) {
	return `${QUESTIONNAIRE_ANSWERS_PATH}.${questionId}.answer` as const;
}

function commentFieldPath<QuestionId extends string>(questionId: QuestionId) {
	return `${QUESTIONNAIRE_ANSWERS_PATH}.${questionId}.comment` as const;
}

function useQuestionnaireForm<
	FormValues extends FieldValues,
	QuestionId extends string,
>() {
	const {
		formState: { errors },
		register,
		setValue,
	} = useFormContext<FormValues>();

	const questionnaireAnswers = useWatch<FormValues>({
		name: QUESTIONNAIRE_ANSWERS_PATH as Path<FormValues>,
	}) as QuestionnaireAnswerMap<QuestionId> | undefined;

	return {
		errors,
		questionnaireAnswers,
		register,
		setValue,
	};
}

function getQuestionnaireAnswerError<
	FormValues extends FieldValues,
	QuestionId extends string,
>(errors: FieldErrors<FormValues>, questionId: QuestionId): string | undefined {
	const message = (
		errors as { questionnaire?: { answers?: Record<string, unknown> } }
	).questionnaire?.answers?.[questionId] as
		| { answer?: { message?: unknown } }
		| undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}

function evaluateQuestionGroup<QuestionId extends string>(
	group: ScoringQuestionGroup<QuestionId>,
	answers: QuestionnaireAnswerMap<QuestionId> | undefined,
): GroupEvaluation | null {
	const selectedNodes = getSelectedPathNodes(
		group,
		answers,
		group.questions.length,
	);
	if (!selectedNodes) {
		return null;
	}

	const score = selectedNodes.reduce(
		(total, node) => total + (node.weight ?? 0),
		0,
	);
	const currentGrade = selectedNodes[selectedNodes.length - 1]?.grade;

	return {
		weightedScore: score * group.groupWeight,
		grade: currentGrade,
	};
}

function getFieldsToClearOnChange<QuestionId extends string>(
	group: ScoringQuestionGroup<QuestionId>,
	questionIndex: number,
): QuestionId[] {
	return group.questions
		.slice(questionIndex + 1)
		.map((question) => question.questionId);
}
