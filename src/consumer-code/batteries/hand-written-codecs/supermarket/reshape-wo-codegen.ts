import { z } from "zod";
import {
	buildAddFieldAdapterAndOutputSchema,
	pipeCodecs,
} from "~/lib/codec-builder-library/adapter-builder";
import { AnswerLevelSchema } from "../../generated/supermarket/server-schema";
import {
	supermarketFieldAdaptersCodec,
	WithFieldsAdapted,
} from "./adapt-fields";
import {
	SUPERMARKET_QUESTION_IDS,
	type SupermarketQuestionId,
} from "./questionarie-question-ids";

type QuestionnairePair = {
	answer: string | null;
	comment: string;
};

type QuestionnaireMetaForReconstruction = {
	serverShapeVersion: number;
	source: string;
	answersMeta: Array<{
		id: number;
		level: z.infer<typeof AnswerLevelSchema>;
	}>;
};

type QuestionnaireAnswers = Record<SupermarketQuestionId, QuestionnairePair>;

type Questionnaire = {
	answers: QuestionnaireAnswers;
	metaForReconstruction: QuestionnaireMetaForReconstruction;
};

const questionnairePairSchema = z.object({
	answer: z.string().nullable(),
	comment: z.string(),
});

const answerMetaSchema = z.object({
	id: z.number(),
	level: AnswerLevelSchema,
});

const questionnaireAnswersShape = Object.fromEntries(
	SUPERMARKET_QUESTION_IDS.map((questionId) => [
		questionId,
		questionnairePairSchema,
	]),
) as Record<SupermarketQuestionId, typeof questionnairePairSchema>;

const questionnaireMetaForReconstructionSchema = z
	.object({
		serverShapeVersion: z.number().int().nonnegative(),
		source: z.string(),
		answersMeta: z.array(answerMetaSchema),
	})
	.strict();

const questionnaireSchema = z
	.object({
		answers: z.object(questionnaireAnswersShape).strict(),
		metaForReconstruction: questionnaireMetaForReconstructionSchema,
	})
	.strict();

function answerPair(answer: string | undefined, comment: string | undefined) {
	const normalizedAnswer = answer && answer.trim().length > 0 ? answer : null;

	return {
		answer: normalizedAnswer,
		comment: comment ?? "",
	} satisfies QuestionnairePair;
}

const supermarketQuestionnaireCodec = buildAddFieldAdapterAndOutputSchema(
	WithFieldsAdapted,
	{
		fieldName: "questionnaire",
		fieldSchema: questionnaireSchema,
		dropFields: [
			"sm_q01_answer",
			"sm_q01_comment",
			"sm_q05_answer",
			"sm_q05_comment",
			"sm_q06_answer",
			"sm_q06_comment",
			"sm_q07_answer",
			"sm_q07_comment",
			"sm_q08_answer",
			"sm_q08_comment",
			"sm_q09_answer",
			"sm_q09_comment",
			"sm_q10_answer",
			"sm_q10_comment",
			"sm_q11_answer",
			"sm_q11_comment",
			"answers",
		],
		construct: (input): Questionnaire => {
			const firstAnswer = input.answers[0];

			const answers = {
				SM_Q01: answerPair(input.sm_q01_answer, input.sm_q01_comment),
				SM_Q02: answerPair(
					firstAnswer?.sm_lvl_q02_answer,
					firstAnswer?.sm_lvl_q02_comment,
				),
				SM_Q03: answerPair(
					firstAnswer?.sm_lvl_q03_answer,
					firstAnswer?.sm_lvl_q03_comment,
				),
				SM_Q04: answerPair(
					firstAnswer?.sm_lvl_q04_answer,
					firstAnswer?.sm_lvl_q04_comment,
				),
				SM_Q05: answerPair(input.sm_q05_answer, input.sm_q05_comment),
				SM_Q06: answerPair(input.sm_q06_answer, input.sm_q06_comment),
				SM_Q07: answerPair(input.sm_q07_answer, input.sm_q07_comment),
				SM_Q08: answerPair(input.sm_q08_answer, input.sm_q08_comment),
				SM_Q09: answerPair(input.sm_q09_answer, input.sm_q09_comment),
				SM_Q10: answerPair(input.sm_q10_answer, input.sm_q10_comment),
				SM_Q11: answerPair(input.sm_q11_answer, input.sm_q11_comment),
			} satisfies QuestionnaireAnswers;

			return {
				answers,
				metaForReconstruction: {
					serverShapeVersion: 2,
					source: "supermarket",
					answersMeta: input.answers.map(({ id, level }) => ({ id, level })),
				},
			};
		},
		reconstruct: (questionnaire) => ({
			sm_q01_answer: questionnaire.answers.SM_Q01.answer ?? "",
			sm_q01_comment: questionnaire.answers.SM_Q01.comment,
			sm_q05_answer: questionnaire.answers.SM_Q05.answer ?? "",
			sm_q05_comment: questionnaire.answers.SM_Q05.comment,
			sm_q06_answer: questionnaire.answers.SM_Q06.answer ?? "",
			sm_q06_comment: questionnaire.answers.SM_Q06.comment,
			sm_q07_answer: questionnaire.answers.SM_Q07.answer ?? "",
			sm_q07_comment: questionnaire.answers.SM_Q07.comment,
			sm_q08_answer: questionnaire.answers.SM_Q08.answer ?? "",
			sm_q08_comment: questionnaire.answers.SM_Q08.comment,
			sm_q09_answer: questionnaire.answers.SM_Q09.answer ?? "",
			sm_q09_comment: questionnaire.answers.SM_Q09.comment,
			sm_q10_answer: questionnaire.answers.SM_Q10.answer ?? "",
			sm_q10_comment: questionnaire.answers.SM_Q10.comment,
			sm_q11_answer: questionnaire.answers.SM_Q11.answer ?? "",
			sm_q11_comment: questionnaire.answers.SM_Q11.comment,
			answers: questionnaire.metaForReconstruction.answersMeta.map(
				({ id, level }) => ({
					id,
					level,
					sm_lvl_q02_answer: questionnaire.answers.SM_Q02.answer ?? "",
					sm_lvl_q02_comment: questionnaire.answers.SM_Q02.comment,
					sm_lvl_q03_answer: questionnaire.answers.SM_Q03.answer ?? "",
					sm_lvl_q03_comment: questionnaire.answers.SM_Q03.comment,
					sm_lvl_q04_answer: questionnaire.answers.SM_Q04.answer ?? "",
					sm_lvl_q04_comment: questionnaire.answers.SM_Q04.comment,
				}),
			),
		}),
	},
);

export const SupermarketFormSchema = supermarketQuestionnaireCodec.outputSchema;

export const SupermarketCodec = pipeCodecs(
	supermarketFieldAdaptersCodec,
	supermarketQuestionnaireCodec,
);
