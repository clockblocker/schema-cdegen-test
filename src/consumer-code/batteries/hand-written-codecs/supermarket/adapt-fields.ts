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
	sm_lvl_q02_answer: noOpCodec,
	sm_lvl_q02_comment: noOpCodec,
	sm_lvl_q03_answer: noOpCodec,
	sm_lvl_q03_comment: noOpCodec,
	sm_lvl_q04_answer: noOpCodec,
	sm_lvl_q04_comment: noOpCodec,
} satisfies ShapeOfStrictFieeldAdapter<SupermarketServer["answers"][number]>;

const supermarketFieldCodec = {
	sm_q01_answer: noOpCodec,
	sm_q01_comment: noOpCodec,
	sm_q05_answer: noOpCodec,
	sm_q05_comment: noOpCodec,
	sm_q06_answer: noOpCodec,
	sm_q06_comment: noOpCodec,
	sm_q07_answer: noOpCodec,
	sm_q07_comment: noOpCodec,
	sm_q08_answer: noOpCodec,
	sm_q08_comment: noOpCodec,
	sm_q09_answer: noOpCodec,
	sm_q09_comment: noOpCodec,
	sm_q10_answer: noOpCodec,
	sm_q10_comment: noOpCodec,
	sm_q11_answer: noOpCodec,
	sm_q11_comment: noOpCodec,
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
