import { z } from "zod";
import {
	atomicCodecs,
	buildAddaptersAndOutputSchema,
	type Codec,
	pipeCodecs,
} from "~/lib/codec-builder-library/adapter-builder";
import {
	LibraryReshapedSchema,
	libraryReshapeCodec,
} from "./reshape-wo-codegen";

const { stringNumber, yesNoBool, noOpCodec } = atomicCodecs;

type YesNo = "Yes" | "No";

const yesNoOptionalSchema = z.union([z.enum(["Yes", "No"]), z.undefined()]);

const stringToYesNoOptionalCodec = {
	fromInput: (value: string): YesNo | undefined =>
		value === "Yes" || value === "No" ? value : undefined,
	fromOutput: (value: YesNo | undefined): string => value ?? "",
	outputSchema: yesNoOptionalSchema,
} satisfies Codec<YesNo | undefined, string, typeof yesNoOptionalSchema>;

const libraryFieldCodec = {
	id: noOpCodec,
	dateOfConstuction: noOpCodec,
	libraryName: noOpCodec,
	city: noOpCodec,
	country: noOpCodec,
	memberCapacity: stringNumber,
	openLate: yesNoBool,
	questionare: {
		q1: {
			answer: stringToYesNoOptionalCodec,
			comment: noOpCodec,
		},
		q2: {
			answer: stringToYesNoOptionalCodec,
			comment: noOpCodec,
		},
	},
};

export const libraryFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	LibraryReshapedSchema,
	libraryFieldCodec,
);

export const LibraryCodec = pipeCodecs(
	libraryReshapeCodec,
	libraryFieldAdaptersCodec,
);

export const LibraryFormSchema = libraryFieldAdaptersCodec.outputSchema;
