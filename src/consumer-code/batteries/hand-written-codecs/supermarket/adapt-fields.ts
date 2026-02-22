import {
	atomicCodecs,
	buildAddaptersAndOutputSchema,
	type ShapeOfStrictFieeldAdapter,
} from "~/lib/codec-builder-library/adapter-builder";
import {
	type SupermarketServer,
	SupermarketServerSchema,
} from "../../generated/supermarket/server-schema";

const { arrayOf, stringNumber, yesNoBool, noOpCodec } = atomicCodecs;

const answersItemFieldCodec = {
	id: noOpCodec,
	level: noOpCodec,
	ans_to_q2: noOpCodec,
	comment_to_q2: noOpCodec,
	ans_to_q3: noOpCodec,
	comment_to_q3: noOpCodec,
	ans_to_q4: noOpCodec,
	comment_to_q4: noOpCodec,
} satisfies ShapeOfStrictFieeldAdapter<SupermarketServer["answers"][number]>;

const supermarketFieldCodec = {
	ans_to_q1: noOpCodec,
	comment_to_q1: noOpCodec,
	ans_to_q5: noOpCodec,
	comment_to_q5: noOpCodec,
	ans_to_q6: noOpCodec,
	comment_to_q6: noOpCodec,
	id: noOpCodec,
	dateOfConstuction: noOpCodec,
	answers: arrayOf(answersItemFieldCodec),
	libraryName: noOpCodec,
	address: {
		city: noOpCodec,
		country: noOpCodec,
	},
	memberCapacity: stringNumber,
	openLate: yesNoBool,
};

export const supermarketFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	SupermarketServerSchema,
	supermarketFieldCodec,
);
export const WithFieldsAdapted = supermarketFieldAdaptersCodec.outputSchema;
