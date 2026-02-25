export const QUESTIONARE_ANSWERS_PATH = "questionare.answers" as const;

export const answerFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONARE_ANSWERS_PATH}.${questionId}.answer` as const;

export const commentFieldPath = <QuestionId extends string>(
	questionId: QuestionId,
) => `${QUESTIONARE_ANSWERS_PATH}.${questionId}.comment` as const;
