import type { Audut } from "~/consumer-code/batteries/batteries-types";
import type { UiScoringAnswerTree } from "~/consumer-code/supermarket/questionnaire-config";

export type SupermarketAudit = Audut<"Supermarket">;
export type SupermarketAnswers = SupermarketAudit["questionare"]["answers"];

export type AnswerOption = {
	answerId: string;
	node: UiScoringAnswerTree;
};

export type GroupEvaluation = {
	weightedScore: number;
	grade?: string;
};
