import type { UseFormRegisterReturn } from "react-hook-form";
import type { QuestionnaireAnswerIdForQuestion } from "~/lib/questionnaire-id-types";
import type {
	ScoringAnswerTree,
	ScoringQuestionGroup,
	ScoringQuestionGroups,
} from "~/lib/questionnaire-scoring-types";

export type { ScoringAnswerTree, ScoringQuestionGroup, ScoringQuestionGroups };

export type AnswerOption<AnswerId extends string = string> = {
	answerId: AnswerId;
	node: ScoringAnswerTree;
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
		group: ScoringQuestionGroup<QuestionId>,
		questionIndex: number,
	) => void;
	getAnswerError: (questionId: QuestionId) => string | undefined;
	registerAnswer: (questionId: QuestionId) => UseFormRegisterReturn;
	registerComment: (questionId: QuestionId) => UseFormRegisterReturn;
};
