import { z } from "zod";
import {
	buildEvenLooserAddaptersAndOutputSchema,
	type Codec,
	fromPath,
	fromPaths,
	removeField,
} from "~/lib/codec-builder-library/adapter-builder";
import { LibraryServerSchema } from "../../generated/library/server-schema";

type RawQuestionarePair = {
	answer: string;
	comment: string;
};

const rawQuestionarePairSchema = z.object({
	answer: z.string(),
	comment: z.string(),
});

const rawQuestionarePairCodec = {
	fromInput: (pair: unknown[]): RawQuestionarePair => ({
		answer: typeof pair[0] === "string" ? pair[0] : "",
		comment: typeof pair[1] === "string" ? pair[1] : "",
	}),
	fromOutput: (pair: RawQuestionarePair): unknown[] => [
		pair.answer,
		pair.comment,
	],
	outputSchema: rawQuestionarePairSchema,
} satisfies Codec<
	RawQuestionarePair,
	unknown[],
	typeof rawQuestionarePairSchema
>;

const libraryReshapeShape = {
	ans_to_q1: removeField,
	comment_to_q1_: removeField,
	answers: removeField,
	address: removeField,
	city: fromPath("address.city"),
	country: fromPath("address.country"),
	memberCapacity: fromPath("memberCapacity"),
	openLate: fromPath("openLate"),
	questionare: {
		q1: fromPaths(["ans_to_q1", "comment_to_q1_"], rawQuestionarePairCodec),
		q2: fromPaths(
			["answers[0].ans_to_q2", "answers[0].comment_to_q2_"],
			rawQuestionarePairCodec,
		),
	},
};

export const { outputSchema: LibraryReshapedSchema, ...libraryReshapeCodec } =
	buildEvenLooserAddaptersAndOutputSchema(LibraryServerSchema, libraryReshapeShape);
