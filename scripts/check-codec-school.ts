import assert from "node:assert/strict";
import { SchoolFormSchema } from "../src/consumer-code/batteries/generated/school/reshape-schema";
import { SchoolServerSchema } from "../src/consumer-code/batteries/generated/school/server-schema";
import { SchoolServerToFormCodec } from "../src/consumer-code/batteries/batteries";

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

const formOut = SchoolServerToFormCodec.fromInput(serverSample);
SchoolFormSchema.parse(formOut);

const serverRoundtrip = SchoolServerToFormCodec.fromOutput(formOut);
SchoolServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, {
	questionsSchool: serverSample.questionsSchool,
	classrooms: [
		{ id: 20, wallColor: "red" },
		{ id: 10, wallColor: "red" },
		{ id: 5, wallColor: "red" },
	],
});

const formRoundtrip = SchoolServerToFormCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("School codec roundtrip check passed");
