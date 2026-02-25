import { z } from "zod";
import {
	type Codec,
	pipeCodecs,
	type ReshapeShapeFor,
	reshapeFor,
} from "~/lib/codec-builder-library/adapter-builder";
import { libraryFieldAdaptersCodec, WithFieldsAdapted } from "./adapt-fields";

type QuestionarePair = {
	answer: string | null;
	comment: string;
};

const questionarePairSchema = z.object({
	answer: z.string().nullable(),
	comment: z.string(),
});

const questionarePairCodec = {
	fromInput: (
		pair: readonly [string | undefined, string | undefined],
	): QuestionarePair => ({
		answer: pair[0] && pair[0].trim().length > 0 ? pair[0] : null,
		comment: pair[1] ?? "",
	}),
	fromOutput: (pair: QuestionarePair): readonly [string, string] => [
		pair.answer ?? "",
		pair.comment,
	],
	outputSchema: questionarePairSchema,
} satisfies Codec<
	QuestionarePair,
	readonly [string, string],
	typeof questionarePairSchema
>;

const { fromPath, fromPaths, removeField, build } =
	reshapeFor(WithFieldsAdapted);

const libraryReshapeShape = {
	ans_to_q1: removeField,
	comment_to_q1_: removeField,
	answers: removeField,
	address: removeField,
	city: fromPath(["address", "city"]),
	country: fromPath(["address", "country"]),
	memberCapacity: fromPath(["memberCapacity"]),
	openLate: fromPath(["openLate"]),
	questionare: {
		answers: {
			LIB_Q01: fromPaths(
				[["ans_to_q1"], ["comment_to_q1_"]],
				questionarePairCodec,
			),
			LIB_Q02: fromPaths(
				[
					["answers", "0", "ans_to_q2"],
					["answers", "0", "comment_to_q2_"],
				],
				questionarePairCodec,
			),
		},
	},
} satisfies ReshapeShapeFor<typeof WithFieldsAdapted>;

export const { outputSchema: LibraryFormSchema, ...libraryReshapeCodec } =
	build(libraryReshapeShape);

export const LibraryCodec = pipeCodecs(
	libraryFieldAdaptersCodec,
	libraryReshapeCodec,
);
