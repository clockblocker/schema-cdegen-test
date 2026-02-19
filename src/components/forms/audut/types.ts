export type AnswerScore = {
	__typename?: "AnswerScore";
	grade?: string;
	id?: string;
	relatedAnswers: Array<AnswerScore>;
	weight?: number;
};

export type AudutQuestionGroup = {
	__typename?: "AudutQuestionGroup";
	answersTree: Array<AnswerScore>;
	groupId?: number;
	groupWeight?: number;
	questionIds: Array<string>;
};

export type GroupFormValues = Record<string, string | undefined>;

export type AudutFormValues = {
	groups: Record<string, GroupFormValues>;
};
