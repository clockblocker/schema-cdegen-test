import type {
	AuditKindWithQuestionnarie,
	Audut,
} from "~/consumer-code/batteries/batteries-types";
import type { UiScoringAnswerTree } from "~/consumer-code/supermarket/questionnaire-config";

export type QuestionnaireAudit<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = Audut<K>;
export type QuestionnaireAnswers<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = QuestionnaireAudit<K>["questionare"]["answers"];

export type AnswerOption = {
	answerId: string;
	node: UiScoringAnswerTree;
};

export type GroupEvaluation = {
	weightedScore: number;
	grade?: string;
};
