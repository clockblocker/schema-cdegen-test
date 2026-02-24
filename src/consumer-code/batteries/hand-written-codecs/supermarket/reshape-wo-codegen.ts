import { z } from "zod";
import {
	SUPERMARKET_QUESTION_IDS,
	type SupermarketQuestionId,
} from "~/consumer-code/supermarket/questionnaire-config";
import {
	buildAddFieldAdapterAndOutputSchema,
	pipeCodecs,
} from "~/lib/codec-builder-library/adapter-builder";
import { AnswerLevelSchema } from "../../generated/supermarket/server-schema";
import {
	supermarketFieldAdaptersCodec,
	WithFieldsAdapted,
} from "./adapt-fields";

type QuestionarePair = {
	answer: string | null;
	comment: string;
};

type QuestionareMetaForReconstruction = {
	serverShapeVersion: number;
	source: string;
	answersMeta: Array<{
		id: number;
		level: z.infer<typeof AnswerLevelSchema>;
	}>;
};

type QuestionareAnswers = Record<SupermarketQuestionId, QuestionarePair>;

type Questionare = {
	answers: QuestionareAnswers;
	metaForReconstruction: QuestionareMetaForReconstruction;
};

const questionarePairSchema = z.object({
	answer: z.string().nullable(),
	comment: z.string(),
});

const answerMetaSchema = z.object({
	id: z.number(),
	level: AnswerLevelSchema,
});

const questionareAnswersShape = Object.fromEntries(
	SUPERMARKET_QUESTION_IDS.map((questionId) => [
		questionId,
		questionarePairSchema,
	]),
) as Record<SupermarketQuestionId, typeof questionarePairSchema>;

const questionareMetaForReconstructionSchema = z
	.object({
		serverShapeVersion: z.number().int().nonnegative(),
		source: z.string(),
		answersMeta: z.array(answerMetaSchema),
	})
	.strict();

const questionareSchema = z
	.object({
		answers: z.object(questionareAnswersShape).strict(),
		metaForReconstruction: questionareMetaForReconstructionSchema,
	})
	.strict();

function answerPair(answer: string | undefined, comment: string | undefined) {
	const normalizedAnswer = answer && answer.trim().length > 0 ? answer : null;

	return {
		answer: normalizedAnswer,
		comment: comment ?? "",
	} satisfies QuestionarePair;
}

const supermarketQuestionareCodec = buildAddFieldAdapterAndOutputSchema(
	WithFieldsAdapted,
	{
		fieldName: "questionare",
		fieldSchema: questionareSchema,
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
		construct: (input): Questionare => {
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
			} satisfies QuestionareAnswers;

			return {
				answers,
				metaForReconstruction: {
					serverShapeVersion: 2,
					source: "supermarket",
					answersMeta: input.answers.map(({ id, level }) => ({ id, level })),
				},
			};
		},
		reconstruct: (questionare) => ({
			sm_q01_answer: questionare.answers.SM_Q01.answer ?? "",
			sm_q01_comment: questionare.answers.SM_Q01.comment,
			sm_q05_answer: questionare.answers.SM_Q05.answer ?? "",
			sm_q05_comment: questionare.answers.SM_Q05.comment,
			sm_q06_answer: questionare.answers.SM_Q06.answer ?? "",
			sm_q06_comment: questionare.answers.SM_Q06.comment,
			sm_q07_answer: questionare.answers.SM_Q07.answer ?? "",
			sm_q07_comment: questionare.answers.SM_Q07.comment,
			sm_q08_answer: questionare.answers.SM_Q08.answer ?? "",
			sm_q08_comment: questionare.answers.SM_Q08.comment,
			sm_q09_answer: questionare.answers.SM_Q09.answer ?? "",
			sm_q09_comment: questionare.answers.SM_Q09.comment,
			sm_q10_answer: questionare.answers.SM_Q10.answer ?? "",
			sm_q10_comment: questionare.answers.SM_Q10.comment,
			sm_q11_answer: questionare.answers.SM_Q11.answer ?? "",
			sm_q11_comment: questionare.answers.SM_Q11.comment,
			answers: questionare.metaForReconstruction.answersMeta.map(
				({ id, level }) => ({
					id,
					level,
					sm_lvl_q02_answer: questionare.answers.SM_Q02.answer ?? "",
					sm_lvl_q02_comment: questionare.answers.SM_Q02.comment,
					sm_lvl_q03_answer: questionare.answers.SM_Q03.answer ?? "",
					sm_lvl_q03_comment: questionare.answers.SM_Q03.comment,
					sm_lvl_q04_answer: questionare.answers.SM_Q04.answer ?? "",
					sm_lvl_q04_comment: questionare.answers.SM_Q04.comment,
				}),
			),
		}),
	},
);

export const SupermarketFormSchema = supermarketQuestionareCodec.outputSchema;

export const SupermarketCodec = pipeCodecs(
	supermarketFieldAdaptersCodec,
	supermarketQuestionareCodec,
);
