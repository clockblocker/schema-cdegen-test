import type { UiScoringAnswerTree } from "~/consumer-code/supermarket/questionnaire-config";

export type AnswerOption = {
	answerId: string;
	node: UiScoringAnswerTree;
};

export type GroupEvaluation = {
	weightedScore: number;
	grade?: string;
};

export type QuestionnaireAnswerMap = Record<
	string,
	| {
			answer?: string | null;
			comment?: string | null;
	  }
	| undefined
>;
