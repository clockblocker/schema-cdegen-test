import assert from "node:assert/strict";
import { SchoolServerSchema } from "../src/consumer-code/batteries/generated/school/server-schema";
import {
	SchoolCodec,
	SchoolFormSchema,
} from "../src/consumer-code/batteries/hand-written-codecs/school/adapt-fields";

const serverSample = SchoolServerSchema.parse({
	questionsSchool: {
		q3: true,
		q4: false,
	},
	classrooms: [
		{ id: 20, wallColor: "blue" },
		{ id: 10, wallColor: "yellow" },
		{ id: 5, wallColor: "red" },
	],
});

const formOut = SchoolCodec.fromInput(serverSample);
SchoolFormSchema.parse(formOut);

const serverRoundtrip = SchoolCodec.fromOutput(formOut);
SchoolServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, {
	questionsSchool: serverSample.questionsSchool,
	classrooms: [
		{ id: 20, wallColor: "red" },
		{ id: 10, wallColor: "red" },
		{ id: 5, wallColor: "red" },
	],
});

const formRoundtrip = SchoolCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("School codec roundtrip check passed");
