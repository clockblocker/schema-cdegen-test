export type ScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[answerId: string]: ScoringAnswerTree | string | number | undefined;
};

export type ScoringQuestionGroup<QuestionId extends string = string> = {
	questions: Array<{
		questionId: QuestionId;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: ScoringAnswerTree;
};

export type ScoringQuestionGroups<QuestionId extends string = string> =
	ScoringQuestionGroup<QuestionId>[];
