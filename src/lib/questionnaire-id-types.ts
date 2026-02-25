type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TwoDigits = `${Digit}${Digit}`;

export type QuestionnaireQuestionId<Tag extends string> =
	`${Uppercase<Tag>}_Q${TwoDigits}`;

export type QuestionnaireAnswerIdForQuestion<QuestionId extends string> =
	`${QuestionId}_A${TwoDigits}`;
