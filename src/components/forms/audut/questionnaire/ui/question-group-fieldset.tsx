import type {
	GroupEvaluation,
	QuestionnaireFormApi,
	ParsedScoringQuestionGroup,
} from "../model/types";
import { QuestionnaireQuestionRow } from "./question-row";

type QuestionnaireGroupFieldsetProps<QuestionId extends string> = {
	formApi: QuestionnaireFormApi<QuestionId>;
	group: ParsedScoringQuestionGroup<QuestionId>;
	groupIndex: number;
	evaluation: GroupEvaluation | null;
};

export function QuestionnaireGroupFieldset<QuestionId extends string>({
	formApi,
	group,
	groupIndex,
	evaluation,
}: QuestionnaireGroupFieldsetProps<QuestionId>) {
	return (
		<fieldset className="flex flex-col gap-4 rounded-lg border p-4">
			<div className="flex items-center justify-between gap-2">
				<legend className="font-medium text-sm">Group {groupIndex + 1}</legend>
				{evaluation && (
					<span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground text-xs">
						Score: {evaluation.weightedScore}
						{evaluation.grade ? ` • ${evaluation.grade}` : ""}
					</span>
				)}
			</div>

			{group.questions.map((question, questionIndex) => (
				<QuestionnaireQuestionRow<QuestionId>
					formApi={formApi}
					group={group}
					key={question.questionId}
					questionIndex={questionIndex}
				/>
			))}
		</fieldset>
	);
}
