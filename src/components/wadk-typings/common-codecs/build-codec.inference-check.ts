import { z } from "zod";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import {
	arrayOf,
	buildCodecAndFormSchema,
	type Codec,
	defineCodec,
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

const widened = buildCodecAndFormSchema(ClientSchemaWidened(), {
	id: noOpCodec,
	counterparties: arrayOf(counterpartyCodec),
});

buildCodecAndFormSchema(ClientSchemaWidened(), {
	// @ts-expect-error widened scalar number field cannot use yes/no codec
	id: yesNoBool,
	counterparties: arrayOf(counterpartyCodec),
});

buildCodecAndFormSchema(ClientSchemaWidened(), {
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

buildCodecAndFormSchema(strict, {
	// @ts-expect-error number field cannot use yes/no codec
	id: yesNoBool,
});

buildCodecAndFormSchema(strict, {
	// @ts-expect-error scalar field cannot use array shape
	id: arrayOf(counterpartyCodec),
});

const numberOrStringInputCodec = defineCodec({
	fromInput: (v: number | string) => String(v),
	fromOutput: (v: string) => Number(v),
	outputSchema: z.string(),
});
const _minimalCodecApi: Codec<string, number | string> =
	numberOrStringInputCodec;

buildCodecAndFormSchema(strict, {
	id: numberOrStringInputCodec,
});

void _widenedArrayCheck;
void _minimalCodecApi;
