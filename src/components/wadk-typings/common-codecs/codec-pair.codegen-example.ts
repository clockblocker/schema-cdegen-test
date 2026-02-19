import { z } from "zod";
import { buildAddaptersAndOutputSchema, noOpCodec, type Codec } from "./build-codec";
import { codec, pipeCodecs } from "./codec-pair";

export const ExampleServerSchema = z.object({
	id: z.number(),
	isActive: z.boolean(),
	amount: z.number().nullable(),
	createdAtIso: z.string().nullable(),
	tags: z.array(z.string()),
	address: z.object({
		line1: z.string().nullable(),
		countryCode: z.enum(["US", "CA"]).nullable(),
	}),
});

type ExampleServer = z.infer<typeof ExampleServerSchema>;

const numberStringRequired = {
	fromInput: (input: number) => String(input),
	fromOutput: (output: string) => Number(output),
	outputSchema: z.string(),
} satisfies Codec<string, number, z.ZodString>;

const boolYesNoRequired = {
	fromInput: (input: boolean) => (input ? "Yes" : "No") as "Yes" | "No",
	fromOutput: (output: "Yes" | "No") => output === "Yes",
	outputSchema: z.enum(["Yes", "No"]),
} satisfies Codec<"Yes" | "No", boolean, z.ZodEnum<["Yes", "No"]>>;

const nullableNumberText = {
	fromInput: (input: number | null) => (input === null ? null : String(input)),
	fromOutput: (output: string | null) =>
		output === null ? null : Number(output),
	outputSchema: z.string().nullable(),
} satisfies Codec<string | null, number | null, z.ZodNullable<z.ZodString>>;

const nullableIsoDate = {
	fromInput: (input: string | null) => (input === null ? null : new Date(input)),
	fromOutput: (output: Date | null) =>
		output === null ? null : output.toISOString(),
	outputSchema: z.date().nullable(),
} satisfies Codec<Date | null, string | null, z.ZodNullable<z.ZodDate>>;

const normalizeServer = buildAddaptersAndOutputSchema(ExampleServerSchema, {
	id: numberStringRequired,
	isActive: boolYesNoRequired,
	amount: nullableNumberText,
	createdAtIso: nullableIsoDate,
	tags: noOpCodec,
	address: {
		line1: {
			fromInput: (input: string | null) => (input === null ? "" : input),
			fromOutput: (output: string) => (output === "" ? null : output),
			outputSchema: z.string(),
		} satisfies Codec<string, string | null, z.ZodString>,
		countryCode: noOpCodec,
	},
});

type NormalizedForm = z.infer<typeof normalizeServer.outputSchema>;

const normalizeServerCodec = {
	fromInput: normalizeServer.fromInput,
	fromOutput: normalizeServer.fromOutput,
};

const projectFormCodec = codec<NormalizedForm>()((input) => ({
	meta: {
		id: input.id,
		status: input.isActive,
	},
	financial: {
		amountText: input.amount,
	},
	createdAt: input.createdAtIso,
	tagItems: input.tags.map((tag) => ({ value: tag })),
	addressLine1: input.address.line1,
	countryCode: input.address.countryCode,
}))((output) => ({
	id: output.meta.id,
	isActive: output.meta.status,
	amount: output.financial.amountText,
	createdAtIso: output.createdAt,
	tags: output.tagItems.map((item) => item.value),
	address: {
		line1: output.addressLine1,
		countryCode: output.countryCode,
	},
}));

export const ExampleServerToFormCodec = pipeCodecs(
	normalizeServerCodec,
	projectFormCodec,
);

export type ExampleForm = ReturnType<(typeof ExampleServerToFormCodec)["fromInput"]>;
