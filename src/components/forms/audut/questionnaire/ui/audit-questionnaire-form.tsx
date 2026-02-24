import type { AuditKindWithQuestionnarie } from "~/consumer-code/batteries/batteries-types";
import type { UiScoringQuestionGroups } from "~/consumer-code/supermarket/questionnaire-config";
import { useQuestionnaireForm } from "../hooks/use-questionnaire-form";
import { evaluateQuestionGroup } from "../model/scoring";
import type { GroupEvaluation } from "../model/types";
import { QuestionnaireGroupFieldset } from "./question-group-fieldset";

type AuditQuestionnaireFormProps<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = {
	auditKind?: K;
	questionGroups: UiScoringQuestionGroups;
};

export function AuditQuestionnaireForm<K extends AuditKindWithQuestionnarie>({
	questionGroups,
}: AuditQuestionnaireFormProps<K>) {
	const { questionnaireAnswers } = useQuestionnaireForm();

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
					evaluation={groupEvaluations[groupIndex] ?? null}
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
