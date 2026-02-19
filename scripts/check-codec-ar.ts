import assert from "node:assert/strict";
import { ArFormSchema } from "../src/consumer-code/batteries/generated/ar/reshape-schema";
import {
	ArServerSchema,
	ArServerToFormCodec,
} from "../src/consumer-code/batteries/hand-written-codecs/ar";

const serverSample = ArServerSchema.parse({
	q1l0: true,
	q2l0: false,
	q3l0: 101,
	q4l0: "2026-01-01T10:00:00.000Z",
	q5l0: "l0",
	l1: {
		q1l1: false,
		q2l1: true,
		q3l1: 202,
		q4l1: "2026-01-02T10:00:00.000Z",
		q5l1: "l1",
		l2: {
			q1l2: true,
			q2l2: false,
			q3l2: 303,
			q4l2: "2026-01-03T10:00:00.000Z",
			q5l2: "l2",
		},
		l2_arr: [
			{
				q1l2: true,
				q2l2: true,
				q3l2: 404,
				q4l2: "2026-01-04T10:00:00.000Z",
				q5l2: "a",
				l3_arr: [
					{
						q1l2: false,
						q2l2: true,
						q3l2: 505,
						q4l2: "2026-01-05T10:00:00.000Z",
						q5l2: "b",
					},
				],
			},
		],
	},
});

const formOut = ArServerToFormCodec.fromInput(serverSample);
ArFormSchema.parse(formOut);

const serverRoundtrip = ArServerToFormCodec.fromOutput(formOut);
ArServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, serverSample);

const formRoundtrip = ArServerToFormCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("AR codec roundtrip check passed");
