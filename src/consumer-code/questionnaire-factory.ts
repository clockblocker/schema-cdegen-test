import type { ParsedScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import { LIBRARY_QUESTION_IDS } from "~/consumer-code/batteries/hand-written-codecs/library/questionarie-question-ids";
import { SUPERMARKET_QUESTION_IDS } from "~/consumer-code/batteries/hand-written-codecs/supermarket/questionarie-question-ids";

type RawScoringAnswerTree = {
	answerText: string;
	grade?: string;
	weight?: number;
	[key: string]: RawScoringAnswerTree | string | number | undefined;
};

export type RawScoringQuestionGroup<QuestionId extends string = string> = {
	questions: Array<{
		questionId: QuestionId;
		questionText: string;
	}>;
	groupWeight: number;
	answersTree: RawScoringAnswerTree;
};

const TREE_META_KEYS = new Set(["answerText", "grade", "weight"]);

function isRawScoringAnswerTree(value: unknown): value is RawScoringAnswerTree {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return typeof (value as { answerText?: unknown }).answerText === "string";
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isAnswerIdForQuestion(answerId: string, questionId: string): boolean {
	return new RegExp(`^${escapeRegExp(questionId)}_A\\d{2}$`).test(answerId);
}

function validateAnswerTreeNode(
	node: RawScoringAnswerTree,
	questionIdsByDepth: string[],
	depth: number,
	groupIndex: number,
) {
	for (const [rawAnswerId, value] of Object.entries(node)) {
		if (TREE_META_KEYS.has(rawAnswerId)) {
			continue;
		}

		const expectedQuestionId = questionIdsByDepth[depth];
		if (!expectedQuestionId) {
			throw new Error(
				`Invalid questionnaire tree: found answer "${rawAnswerId}" deeper than questions list in group ${
					groupIndex + 1
				}.`,
			);
		}
		if (!isAnswerIdForQuestion(rawAnswerId, expectedQuestionId)) {
			throw new Error(
				`Invalid questionnaire answer ID "${rawAnswerId}" in group ${
					groupIndex + 1
				}. Expected "${expectedQuestionId}_A{NN}".`,
			);
		}
		if (!isRawScoringAnswerTree(value)) {
			throw new Error(
				`Invalid questionnaire tree node at "${rawAnswerId}" in group ${
					groupIndex + 1
				}.`,
			);
		}

		validateAnswerTreeNode(value, questionIdsByDepth, depth + 1, groupIndex);
	}
}

function validateQuestionGroup<QuestionId extends string>(
	group: RawScoringQuestionGroup<QuestionId>,
	knownQuestionIds: ReadonlySet<string>,
	groupIndex: number,
) {
	const questionIdsByDepth = group.questions.map((question) => {
		if (!knownQuestionIds.has(question.questionId)) {
			throw new Error(
				`Invalid question ID "${question.questionId}" in group ${
					groupIndex + 1
				}.`,
			);
		}

		return question.questionId;
	});

	validateAnswerTreeNode(group.answersTree, questionIdsByDepth, 0, groupIndex);
}

const QUESTION_IDS_BY_AUDIT_KIND = {
	Library: LIBRARY_QUESTION_IDS,
	Supermarket: SUPERMARKET_QUESTION_IDS,
} as const;

export type AuditKind = keyof typeof QUESTION_IDS_BY_AUDIT_KIND;

type QuestionIdForAuditKind<K extends AuditKind> =
	(typeof QUESTION_IDS_BY_AUDIT_KIND)[K][number];

export function buildParsedScoringQuestionGroups<K extends AuditKind>(
	auditKind: K,
	serverGroups: RawScoringQuestionGroup<string>[],
): ParsedScoringQuestionGroups<QuestionIdForAuditKind<K>> {
	const questionIds = QUESTION_IDS_BY_AUDIT_KIND[auditKind];
	const knownQuestionIds = new Set<string>(questionIds);

	serverGroups.forEach((group, groupIndex) => {
		validateQuestionGroup(group, knownQuestionIds, groupIndex);
	});

	return serverGroups as ParsedScoringQuestionGroups<QuestionIdForAuditKind<K>>;
}
