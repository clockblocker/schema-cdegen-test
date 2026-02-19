import assert from "node:assert/strict";
import { SchoolFormSchema } from "../src/consumer-code/batteries/generated/school/reshape-schema";
import {
	SchoolServerSchema,
	SchoolServerToFormCodec,
} from "../src/consumer-code/batteries/hand-written-codecs/school";

const serverSample = SchoolServerSchema.parse({
	questionsSchool: {
		q3: true,
		q4: false,
	},
});

const formOut = SchoolServerToFormCodec.fromInput(serverSample);
SchoolFormSchema.parse(formOut);

const serverRoundtrip = SchoolServerToFormCodec.fromOutput(formOut);
SchoolServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, serverSample);

const formRoundtrip = SchoolServerToFormCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("School codec roundtrip check passed");
