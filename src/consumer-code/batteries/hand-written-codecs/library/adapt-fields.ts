import { z } from "zod";
import {
	atomicCodecs,
	buildEvenLooserAddaptersAndOutputSchema,
	type Codec,
	fromPath,
	fromPaths,
	removeField,
} from "~/lib/codec-builder-library/adapter-builder";
import { LibraryServerSchema } from "../../generated/library/server-schema";

const { stringNumber, yesNoBool } = atomicCodecs;

type YesNo = "Yes" | "No";
type QuestionarePair = {
	answer?: YesNo;
	comment: string;
};

const questionarePairSchema = z.object({
	answer: z.union([z.enum(["Yes", "No"]), z.undefined()]),
	comment: z.string(),
});

const questionarePairCodec = {
	fromInput: (pair: unknown[]): QuestionarePair => {
		const rawAnswer = pair[0];
		return {
			answer:
				rawAnswer === "Yes" || rawAnswer === "No"
					? (rawAnswer as YesNo)
					: undefined,
			comment: typeof pair[1] === "string" ? pair[1] : "",
		};
	},
	fromOutput: (pair: QuestionarePair): unknown[] => [
		pair.answer ?? "",
		pair.comment,
	],
	outputSchema: questionarePairSchema,
} satisfies Codec<QuestionarePair, unknown[], typeof questionarePairSchema>;

const libraryCodecShape = {
	ans_to_q1: removeField,
	comment_to_q1_: removeField,
	answers: removeField,
	address: removeField,
	city: fromPath("address.city"),
	country: fromPath("address.country"),
	memberCapacity: fromPath("memberCapacity", stringNumber),
	openLate: fromPath("openLate", yesNoBool),
	questionare: {
		q1: fromPaths(["ans_to_q1", "comment_to_q1_"], questionarePairCodec),
		q2: fromPaths(
			["answers[0].ans_to_q2", "answers[0].comment_to_q2_"],
			questionarePairCodec,
		),
	},
};

const evenLooserLibraryCodec = buildEvenLooserAddaptersAndOutputSchema(
	LibraryServerSchema,
	libraryCodecShape,
);

export const { outputSchema: LibraryFormSchema, ...LibraryCodec } =
	evenLooserLibraryCodec;
