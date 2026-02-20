import { z } from "zod";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import {
	arrayOf,
	buildAddaptersAndOutputSchema,
	buildEvenLooserAddaptersAndOutputSchema,
	buildLooseAddaptersAndOutputSchema,
	type Codec,
	fromPath,
	fromPaths,
	noOpCodec,
	removeField,
	reshapeFor,
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

type LooseNestedDefaultsOutput = z.infer<
	typeof looseNestedDefaults.outputSchema
>;
const _looseNestedDefaultB: LooseNestedDefaultsOutput["a"]["b"] = 1;
const _looseNestedDefaultC: LooseNestedDefaultsOutput["a"]["c"] = "value";

const questionnaireServerSchema = z.object({
	ans_to_q1: z.string(),
	comment_to_q1_: z.string(),
	id: z.number(),
	dateOfConstuction: z.string(),
	answers: z.array(
		z.object({
			ans_to_q2: z.string(),
			comment_to_q2_: z.string(),
		}),
	),
});

type QuestionnaireOutputQ = {
	answer: string;
	comment: string;
};

const qCodec = {
	fromInput: (pair: unknown[]) => ({
		answer: String(pair[0] ?? ""),
		comment: String(pair[1] ?? ""),
	}),
	fromOutput: (q: QuestionnaireOutputQ) => [q.answer, q.comment],
	outputSchema: z.object({
		answer: z.string(),
		comment: z.string(),
	}),
} satisfies Codec<
	QuestionnaireOutputQ,
	unknown[],
	z.ZodObject<{
		answer: z.ZodString;
		comment: z.ZodString;
	}>
>;

const evenLooserQuestionnaire = buildEvenLooserAddaptersAndOutputSchema(
	questionnaireServerSchema,
	{
		ans_to_q1: removeField,
		comment_to_q1_: removeField,
		answers: removeField,
		questionare: {
			q1: fromPaths(["ans_to_q1", "comment_to_q1_"], qCodec),
			q2: fromPaths(
				["answers[0].ans_to_q2", "answers[0].comment_to_q2_"],
				qCodec,
			),
		},
		firstQAnswer: fromPath("ans_to_q1"),
	},
);

type EvenLooserQuestionnaireOutput = z.infer<
	typeof evenLooserQuestionnaire.outputSchema
>;
const _evenLooserQuestionareQ1: EvenLooserQuestionnaireOutput["questionare"]["q1"] =
	{
		answer: "Yes",
		comment: "Because",
	};
const _evenLooserQuestionareQ2: EvenLooserQuestionnaireOutput["questionare"]["q2"] =
	{
		answer: "No",
		comment: "N/A",
	};
const _evenLooserQuestionareFirstQAnswer: EvenLooserQuestionnaireOutput["firstQAnswer"] =
	"Yes";
const _evenLooserQuestionareId: EvenLooserQuestionnaireOutput["id"] = 1;
const _evenLooserQuestionareDate: EvenLooserQuestionnaireOutput["dateOfConstuction"] =
	"2020-01-01";
// @ts-expect-error removed source key should not be present in form output
const _evenLooserQuestionareRemovedField: EvenLooserQuestionnaireOutput["ans_to_q1"] =
	"Yes";

const evenLooserSchemaBoundHelpers = reshapeFor(questionnaireServerSchema);
const evenLooserQuestionnaireWithTuplePaths =
	buildEvenLooserAddaptersAndOutputSchema(questionnaireServerSchema, {
		ans_to_q1: evenLooserSchemaBoundHelpers.removeField,
		comment_to_q1_: evenLooserSchemaBoundHelpers.removeField,
		answers: evenLooserSchemaBoundHelpers.removeField,
		questionare: {
			q1: evenLooserSchemaBoundHelpers.fromPaths(
				[["ans_to_q1"], ["comment_to_q1_"]],
				qCodec,
			),
			q2: evenLooserSchemaBoundHelpers.fromPaths(
				[
					["answers", "0", "ans_to_q2"],
					["answers", "0", "comment_to_q2_"],
				],
				qCodec,
			),
		},
		firstQAnswer: evenLooserSchemaBoundHelpers.fromPath(["ans_to_q1"]),
	});

type EvenLooserQuestionnaireWithTuplePathsOutput = z.infer<
	typeof evenLooserQuestionnaireWithTuplePaths.outputSchema
>;
const _evenLooserTuplePathFirstQAnswer: EvenLooserQuestionnaireWithTuplePathsOutput["firstQAnswer"] =
	"Yes";

void _widenedArrayCheck;
void _strictArrayMappedCheck;
void _looseNestedPacked;
void _looseNestedDefaultB;
void _looseNestedDefaultC;
void _evenLooserQuestionareQ1;
void _evenLooserQuestionareQ2;
void _evenLooserQuestionareFirstQAnswer;
void _evenLooserQuestionareId;
void _evenLooserQuestionareDate;
void _evenLooserTuplePathFirstQAnswer;
