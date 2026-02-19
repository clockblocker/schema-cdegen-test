import assert from "node:assert/strict";
import {
	ReshapeServerSchema,
	ReshapeServerToPartiesCodec,
} from "../src/components/wadk-typings/common-codecs/codec-pair.reshape-example";
import { ReshapeOutputSchema } from "../src/components/wadk-typings/common-codecs/codec-pair.reshape-example.output-schema";

function normalizeDates(value: unknown): unknown {
	if (value instanceof Date) {
		return value.toISOString();
	}
	if (Array.isArray(value)) {
		return value.map((item) => normalizeDates(item));
	}
	if (value && typeof value === "object") {
		const result: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(value)) {
			result[key] = normalizeDates(entry);
		}
		return result;
	}
	return value;
}

const outputSample = ReshapeOutputSchema.parse({
	l0_f0: new Date("2026-01-01T10:00:00.000Z"),
	parties: [
		{ id: 10, l1_f0: new Date("2026-01-10T00:00:00.000Z") },
		{ id: 20, l2_f0: new Date("2026-02-20T00:00:00.000Z") },
	],
});

const serverFromOutput = ReshapeServerToPartiesCodec.fromOutput(outputSample);
ReshapeServerSchema.parse(serverFromOutput);

const outputRoundtrip = ReshapeServerToPartiesCodec.fromInput(serverFromOutput);
ReshapeOutputSchema.parse(outputRoundtrip);

assert.deepStrictEqual(normalizeDates(outputRoundtrip), normalizeDates(outputSample));

const serverCanonical = ReshapeServerToPartiesCodec.fromOutput(outputRoundtrip);
assert.deepStrictEqual(serverCanonical, serverFromOutput);

console.log("codec reshape roundtrip check passed");
