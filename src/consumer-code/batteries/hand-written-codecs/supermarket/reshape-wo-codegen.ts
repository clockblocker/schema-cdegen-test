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

type QuestionarePair = {
	answer: string;
	comment: string;
};

type Questionare = {
	q1: QuestionarePair;
	q2: QuestionarePair;
	q3: QuestionarePair;
	q4: QuestionarePair;
	q5: QuestionarePair;
	q6: QuestionarePair;
	answersMeta: Array<{
		id: number;
		level: z.infer<typeof AnswerLevelSchema>;
	}>;
};

const questionarePairSchema = z.object({
	answer: z.string(),
	comment: z.string(),
});

const answerMetaSchema = z.object({
	id: z.number(),
	level: AnswerLevelSchema,
});

const questionareSchema = z.object({
	q1: questionarePairSchema,
	q2: questionarePairSchema,
	q3: questionarePairSchema,
	q4: questionarePairSchema,
	q5: questionarePairSchema,
	q6: questionarePairSchema,
	answersMeta: z.array(answerMetaSchema),
});

const supermarketQuestionareCodec = buildAddFieldAdapterAndOutputSchema(
	WithFieldsAdapted,
	{
		fieldName: "questionare",
		fieldSchema: questionareSchema,
		construct: (input): Questionare => {
			const firstAnswer = input.answers[0];

			return {
				q1: {
					answer: input.ans_to_q1,
					comment: input.comment_to_q1,
				},
				q2: {
					answer: firstAnswer?.ans_to_q2 ?? "",
					comment: firstAnswer?.comment_to_q2 ?? "",
				},
				q3: {
					answer: firstAnswer?.ans_to_q3 ?? "",
					comment: firstAnswer?.comment_to_q3 ?? "",
				},
				q4: {
					answer: firstAnswer?.ans_to_q4 ?? "",
					comment: firstAnswer?.comment_to_q4 ?? "",
				},
				q5: {
					answer: input.ans_to_q5,
					comment: input.comment_to_q5,
				},
				q6: {
					answer: input.ans_to_q6,
					comment: input.comment_to_q6,
				},
				answersMeta: input.answers.map(({ id, level }) => ({ id, level })),
			};
		},
		reconstruct: (questionare) => ({
			ans_to_q1: questionare.q1.answer,
			comment_to_q1: questionare.q1.comment,
			ans_to_q5: questionare.q5.answer,
			comment_to_q5: questionare.q5.comment,
			ans_to_q6: questionare.q6.answer,
			comment_to_q6: questionare.q6.comment,
			answers: questionare.answersMeta.map(({ id, level }) => ({
				id,
				level,
				ans_to_q2: questionare.q2.answer,
				comment_to_q2: questionare.q2.comment,
				ans_to_q3: questionare.q3.answer,
				comment_to_q3: questionare.q3.comment,
				ans_to_q4: questionare.q4.answer,
				comment_to_q4: questionare.q4.comment,
			})),
		}),
	},
);

export const SupermarketFormSchema = supermarketQuestionareCodec.outputSchema;

export const SupermarketCodec = pipeCodecs(
	supermarketFieldAdaptersCodec,
	supermarketQuestionareCodec,
);
