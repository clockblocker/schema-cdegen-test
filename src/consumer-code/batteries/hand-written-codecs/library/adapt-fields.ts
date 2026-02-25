import {
	atomicCodecs,
	buildAddaptersAndOutputSchema,
} from "~/lib/codec-builder-library/adapter-builder";
import { LibraryServerSchema } from "../../generated/library/server-schema";

const { arrayOf, stringNumber, yesNoBool, noOpCodec } = atomicCodecs;

const answersItemFieldCodec = {
	ans_to_q2: noOpCodec,
	comment_to_q2_: noOpCodec,
};

const libraryFieldCodec = {
	ans_to_q1: noOpCodec,
	comment_to_q1_: noOpCodec,
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

export const libraryFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	LibraryServerSchema,
	libraryFieldCodec,
);
export const WithFieldsAdapted = libraryFieldAdaptersCodec.outputSchema;
