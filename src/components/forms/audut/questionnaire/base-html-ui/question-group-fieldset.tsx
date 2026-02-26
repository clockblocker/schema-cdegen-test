import type {
	GroupEvaluation,
	QuestionnaireFormApi,
	ScoringQuestionGroup,
} from "../model/types";
import { QuestionnaireQuestionRow } from "./question-row";
import { groupFieldset, legend as legendClass, scoreBadge } from "./styles";

type QuestionnaireGroupFieldsetProps<QuestionId extends string> = {
	formApi: QuestionnaireFormApi<QuestionId>;
	group: ScoringQuestionGroup<QuestionId>;
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
		<fieldset className={groupFieldset}>
			<legend className={legendClass}>
				<span>Group {groupIndex + 1}</span>
				{evaluation && (
					<span className={scoreBadge}>
						Score: {evaluation.weightedScore}
						{evaluation.grade ? ` (${evaluation.grade})` : ""}
					</span>
				)}
			</legend>

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
