export type ServerScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[key: string]: ServerScoringAnswerTree | string | number | undefined;
};
