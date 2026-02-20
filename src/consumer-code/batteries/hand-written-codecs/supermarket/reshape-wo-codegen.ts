import { z } from "zod";
import {
	buildAddFieldAdapterAndOutputSchema,
	pipeCodecs,
} from "~/lib/codec-builder-library/adapter-builder";
import {
	supermarketFieldAdaptersCodec,
	WithFieldsAdapted,
} from "./adapt-fields";

type YesNo = "Yes" | "No";
type QuestionarePair = {
	answer?: YesNo;
	comment: string;
};

type Questionare = {
	q1: QuestionarePair;
	q2: QuestionarePair;
};

const questionarePairSchema = z.object({
	answer: z.union([z.enum(["Yes", "No"]), z.undefined()]),
	comment: z.string(),
});

const questionareSchema = z.object({
	q1: questionarePairSchema,
	q2: questionarePairSchema,
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
					comment: input.comment_to_q1_,
				},
				q2: {
					answer: firstAnswer?.ans_to_q2,
					comment: firstAnswer?.comment_to_q2_ ?? "",
				},
			};
		},
		reconstruct: (questionare) => ({
			ans_to_q1: questionare.q1.answer,
			comment_to_q1_: questionare.q1.comment,
			answers: [
				{
					ans_to_q2: questionare.q2.answer,
					comment_to_q2_: questionare.q2.comment,
				},
			],
		}),
	},
);

export const SupermarketFormSchema = supermarketQuestionareCodec.outputSchema;

export const SupermarketCodec = pipeCodecs(
	supermarketFieldAdaptersCodec,
	supermarketQuestionareCodec,
);
