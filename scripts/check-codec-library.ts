import assert from "node:assert/strict";
import { LibraryServerSchema } from "../src/consumer-code/batteries/generated/library/server-schema";
import {
	LibraryCodec,
	LibraryFormSchema,
} from "../src/consumer-code/batteries/hand-written-codecs/library/reshape-wo-codegen";

const serverSample = LibraryServerSchema.parse({
	ans_to_q1: "Yes",
	comment_to_q1_: "q1-comment",
	id: 77,
	dateOfConstuction: "2020-07-01",
	answers: [
		{
			ans_to_q2: "No",
			comment_to_q2_: "q2-comment",
		},
	],
	libraryName: "Central Library",
	memberCapacity: 1250,
	openLate: true,
	address: {
		city: "Berlin",
		country: "Germany",
	},
});

const formOut = LibraryCodec.fromInput(serverSample);
LibraryFormSchema.parse(formOut);

const serverRoundtrip = LibraryCodec.fromOutput(formOut);
LibraryServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, serverSample);

const formRoundtrip = LibraryCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("Library codec roundtrip check passed");
