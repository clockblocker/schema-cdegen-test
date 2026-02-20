import { z } from "zod";
import {
	atomicCodecs,
	buildAddaptersAndOutputSchema,
	type Codec,
} from "~/lib/codec-builder-library/adapter-builder";
import { SupermarketServerSchema } from "../../generated/supermarket/server-schema";

const { arrayOf, stringNumber, yesNoBool, noOpCodec } = atomicCodecs;

type YesNo = "Yes" | "No";

const yesNoOptionalSchema = z.union([z.enum(["Yes", "No"]), z.undefined()]);

const stringToYesNoOptionalCodec = {
	fromInput: (value: string): YesNo | undefined =>
		value === "Yes" || value === "No" ? value : undefined,
	fromOutput: (value: YesNo | undefined): string => value ?? "",
	outputSchema: yesNoOptionalSchema,
} satisfies Codec<YesNo | undefined, string, typeof yesNoOptionalSchema>;

const answersItemFieldCodec = {
	ans_to_q2: stringToYesNoOptionalCodec,
	comment_to_q2_: noOpCodec,
};

const supermarketFieldCodec = {
	ans_to_q1: stringToYesNoOptionalCodec,
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

export const supermarketFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	SupermarketServerSchema,
	supermarketFieldCodec,
);
export const WithFieldsAdapted = supermarketFieldAdaptersCodec.outputSchema;
