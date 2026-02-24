import { useFormContext, useWatch } from "react-hook-form";
import type { AuditKindWithQuestionnarie } from "~/consumer-code/batteries/batteries-types";
import type { UiScoringQuestionGroups } from "~/consumer-code/supermarket/questionnaire-config";
import { QuestionnaireGroupFieldset } from "./question-group-fieldset";
import { evaluateQuestionGroup } from "./tree-model";
import type { GroupEvaluation, QuestionnaireAudit } from "./types";

type AudutQuestionnaireFormProps<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = {
	auditKind?: K;
	questionGroups: UiScoringQuestionGroups;
};

export function AudutQuestionnaireForm<K extends AuditKindWithQuestionnarie>({
	questionGroups,
}: AudutQuestionnaireFormProps<K>) {
	const {
		formState: { errors },
	} = useFormContext<QuestionnaireAudit>();

	const questionnaireAnswers = useWatch<
		QuestionnaireAudit,
		"questionare.answers"
	>({
		name: "questionare.answers",
	});

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
				<QuestionnaireGroupFieldset
					errors={errors}
					evaluation={groupEvaluations[groupIndex] ?? null}
					group={group}
					groupIndex={groupIndex}
					key={`group-${groupIndex + 1}`}
					questionnaireAnswers={questionnaireAnswers}
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
