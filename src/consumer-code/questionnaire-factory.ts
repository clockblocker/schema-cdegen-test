import { LIBRARY_QUESTION_IDS } from "~/consumer-code/batteries/hand-written-codecs/library/questionarie-question-ids";
import { SUPERMARKET_QUESTION_IDS } from "~/consumer-code/batteries/hand-written-codecs/supermarket/questionarie-question-ids";
import type { AuditableBuildingKind } from "~/consumer-code/business-types";
import type {
	ScoringAnswerTree,
	ScoringQuestionGroup,
	ScoringQuestionGroups,
} from "~/lib/questionnaire-scoring-types";

const TREE_META_KEYS = new Set(["answerText", "grade", "weight"]);

function isScoringAnswerTree(value: unknown): value is ScoringAnswerTree {
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
	node: ScoringAnswerTree,
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
		if (!isScoringAnswerTree(value)) {
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
	group: ScoringQuestionGroup<QuestionId>,
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

type QuestionIdForAuditableBuildingKind<K extends AuditableBuildingKind> =
	K extends keyof typeof QUESTION_IDS_BY_AUDIT_KIND
		? (typeof QUESTION_IDS_BY_AUDIT_KIND)[K][number]
		: never;

const QUESTION_IDS_BY_AUDIT_KIND_ALL: Partial<
	Record<AuditableBuildingKind, readonly string[]>
> = QUESTION_IDS_BY_AUDIT_KIND;

export function buildScoringQuestionGroups<K extends AuditableBuildingKind>(
	auditKind: K,
	serverGroups: ScoringQuestionGroup<string>[],
): ScoringQuestionGroups<QuestionIdForAuditableBuildingKind<K>> {
	const questionIds = QUESTION_IDS_BY_AUDIT_KIND_ALL[auditKind];
	if (!questionIds) {
		return [] as ScoringQuestionGroups<QuestionIdForAuditableBuildingKind<K>>;
	}

	const knownQuestionIds = new Set<string>(questionIds);

	serverGroups.forEach((group, groupIndex) => {
		validateQuestionGroup(group, knownQuestionIds, groupIndex);
	});

	return serverGroups as ScoringQuestionGroups<
		QuestionIdForAuditableBuildingKind<K>
	>;
}
