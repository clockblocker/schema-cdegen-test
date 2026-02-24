import type {
	AuditKindWithQuestionnarie,
	Audut,
} from "~/consumer-code/batteries/batteries-types";

export type QuestionnaireAudit<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = Audut<K>;

export type QuestionnaireAnswers<
	K extends AuditKindWithQuestionnarie = AuditKindWithQuestionnarie,
> = QuestionnaireAudit<K>["questionare"]["answers"];

export const QUESTIONARE_ANSWERS_PATH = "questionare.answers" as const;

export const answerFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONARE_ANSWERS_PATH}.${questionId}.answer` as const;

export const commentFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONARE_ANSWERS_PATH}.${questionId}.comment` as const;
