import { z } from "zod";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import { buildLooseAddaptersAndOutputSchema } from "./build-codec.loose";
import { buildAddaptersAndOutputSchema } from "./build-codec.strict";
import {
	arrayOf,
	type Codec,
	noOpCodec,
} from "./build-codec";

type Properties<T> = {
	[K in keyof T]-?: z.ZodType<T[K], z.ZodTypeDef, T[K]>;
};

interface Counterparty {
	id: number | null;
}

interface Client {
	id: number;
	counterparties: Counterparty[];
}

function ClientSchemaWidened(): z.ZodObject<Properties<Client>> {
	return z.object({
		id: z.number(),
		counterparties: z.array(
			z.object({
				id: z.number().nullable(),
			}),
		),
	}) as z.ZodObject<Properties<Client>>;
}

const counterpartyCodec = {
	id: noOpCodec,
};

const widened = buildAddaptersAndOutputSchema(ClientSchemaWidened(), {
	id: noOpCodec,
	counterparties: arrayOf(counterpartyCodec),
});

buildAddaptersAndOutputSchema(ClientSchemaWidened(), {
	// @ts-expect-error widened scalar number field cannot use yes/no codec
	id: yesNoBool,
	counterparties: arrayOf(counterpartyCodec),
});

buildAddaptersAndOutputSchema(ClientSchemaWidened(), {
	// @ts-expect-error widened scalar number field cannot use array shape
	id: arrayOf(counterpartyCodec),
	counterparties: arrayOf(counterpartyCodec),
});

type WidenedOutput = z.infer<typeof widened.outputSchema>;
const _widenedArrayCheck: WidenedOutput["counterparties"] = [{ id: 1 }];
type CounterpartyId = WidenedOutput["counterparties"][number]["id"];

type IsAny<T> = 0 extends 1 & T ? true : false;
type Assert<T extends true> = T;
type AssertFalse<T extends false> = T;

type _counterpartyIdIsNotAny = AssertFalse<IsAny<CounterpartyId>>;
type _counterpartyIdMatches = Assert<
	CounterpartyId extends number | null ? true : false
>;

const strict = z.object({
	id: z.number(),
});

buildAddaptersAndOutputSchema(strict, {
	// @ts-expect-error number field cannot use yes/no codec
	id: yesNoBool,
});

buildAddaptersAndOutputSchema(strict, {
	// @ts-expect-error scalar field cannot use array shape
	id: arrayOf(counterpartyCodec),
});

const numberOrStringInputCodec = {
	fromInput: (v: number | string) => String(v),
	fromOutput: (v: string) => Number(v),
	outputSchema: z.string(),
} satisfies Codec<string, number | string, z.ZodString>;

buildAddaptersAndOutputSchema(strict, {
	id: numberOrStringInputCodec,
});

const strictArray = z.object({
	dates: z.array(z.number()),
});

const numberToDateCodec = {
	fromInput: (v: number) => new Date(v),
	fromOutput: (v: Date) => v.getTime(),
	outputSchema: z.date(),
} satisfies Codec<Date, number, z.ZodDate>;

const strictArrayMapped = buildAddaptersAndOutputSchema(strictArray, {
	dates: arrayOf(numberToDateCodec),
});

type StrictArrayMappedOutput = z.infer<typeof strictArrayMapped.outputSchema>;
const _strictArrayMappedCheck: StrictArrayMappedOutput["dates"] = [new Date()];

buildAddaptersAndOutputSchema(strictArray, {
	// @ts-expect-error number[] item cannot use yes/no codec
	dates: arrayOf(yesNoBool),
});

const strictNested = z.object({
	a: z.object({
		b: z.number(),
		c: z.string(),
	}),
});

buildAddaptersAndOutputSchema(strictNested, {
	a: {
		b: noOpCodec,
		c: noOpCodec,
		packed: noOpCodec,
	},
});

const unknownToStringCodec = {
	fromInput: (v: unknown) => String(v ?? ""),
	fromOutput: (v: string) => v,
	outputSchema: z.string(),
} satisfies Codec<string, unknown, z.ZodString>;

const looseNested = buildLooseAddaptersAndOutputSchema(strictNested, {
	a: {
		b: noOpCodec,
		c: noOpCodec,
		packed: unknownToStringCodec,
	},
});

type LooseNestedOutput = z.infer<typeof looseNested.outputSchema>;
const _looseNestedPacked: LooseNestedOutput["a"]["packed"] = "ok";

const looseNestedDefaults = buildLooseAddaptersAndOutputSchema(strictNested, {
	a: {
		packed: unknownToStringCodec,
	},
});

type LooseNestedDefaultsOutput = z.infer<typeof looseNestedDefaults.outputSchema>;
const _looseNestedDefaultB: LooseNestedDefaultsOutput["a"]["b"] = 1;
const _looseNestedDefaultC: LooseNestedDefaultsOutput["a"]["c"] = "value";

void _widenedArrayCheck;
void _strictArrayMappedCheck;
void _looseNestedPacked;
void _looseNestedDefaultB;
void _looseNestedDefaultC;
