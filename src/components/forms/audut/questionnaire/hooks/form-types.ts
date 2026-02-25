export const QUESTIONNAIRE_ANSWERS_PATH = "questionnaire.answers" as const;

export const answerFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONNAIRE_ANSWERS_PATH}.${questionId}.answer` as const;

export const commentFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONNAIRE_ANSWERS_PATH}.${questionId}.comment` as const;
