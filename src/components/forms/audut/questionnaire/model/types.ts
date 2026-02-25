import type { UseFormRegisterReturn } from "react-hook-form";
import type { QuestionnaireAnswerIdForQuestion } from "~/lib/questionnaire-id-types";

export type ParsedScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[answerId: string]: ParsedScoringAnswerTree | string | number | undefined;
};

export type ParsedScoringQuestionGroup<QuestionId extends string = string> = {
	questions: Array<{
		questionId: QuestionId;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: ParsedScoringAnswerTree;
};

export type ParsedScoringQuestionGroups<QuestionId extends string = string> =
	ParsedScoringQuestionGroup<QuestionId>[];

export type AnswerOption<AnswerId extends string = string> = {
	answerId: AnswerId;
	node: ParsedScoringAnswerTree;
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
		group: ParsedScoringQuestionGroup<QuestionId>,
		questionIndex: number,
	) => void;
	getAnswerError: (questionId: QuestionId) => string | undefined;
	registerComment: (questionId: QuestionId) => UseFormRegisterReturn;
};
