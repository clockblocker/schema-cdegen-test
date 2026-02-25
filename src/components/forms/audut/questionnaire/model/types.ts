import type { UseFormRegisterReturn } from "react-hook-form";
import type { QuestionnaireAnswerIdForQuestion } from "~/lib/questionnaire-id-types";

export type UiScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[answerId: string]: UiScoringAnswerTree | string | number | undefined;
};

export type UiScoringQuestionGroup<QuestionId extends string = string> = {
	questions: Array<{
		questionId: QuestionId;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: UiScoringAnswerTree;
};

export type UiScoringQuestionGroups<QuestionId extends string = string> =
	UiScoringQuestionGroup<QuestionId>[];

export type AnswerOption<AnswerId extends string = string> = {
	answerId: AnswerId;
	node: UiScoringAnswerTree;
};

export type GroupEvaluation = {
	weightedScore: number;
	grade?: string;
};

export type QuestionnaireAnswerMap<QuestionId extends string> = Partial<{
	[Q in QuestionId]: {
		answer?: QuestionnaireAnswerIdForQuestion<Q> | null;
		comment?: string | null;
	};
}>;

export type QuestionnaireFormApi<QuestionId extends string> = {
	questionnaireAnswers: QuestionnaireAnswerMap<QuestionId> | undefined;
	setAnswer: (questionId: QuestionId, answerId: string | null) => void;
	clearDownstream: (
		group: UiScoringQuestionGroup<QuestionId>,
		questionIndex: number,
	) => void;
	getAnswerError: (questionId: QuestionId) => string | undefined;
	registerComment: (questionId: QuestionId) => UseFormRegisterReturn;
};
