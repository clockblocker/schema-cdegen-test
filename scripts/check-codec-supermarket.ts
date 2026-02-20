import assert from "node:assert/strict";
import { SupermarketServerSchema } from "../src/consumer-code/batteries/generated/supermarket/server-schema";
import {
	SupermarketCodec,
	SupermarketFormSchema,
} from "../src/consumer-code/batteries/hand-written-codecs/supermarket/reshape-wo-codegen";

const serverSample = SupermarketServerSchema.parse({
	ans_to_q1: "Yes",
	comment_to_q1: "q1-comment",
	ans_to_q5: "Yes",
	comment_to_q5: "q5-comment",
	ans_to_q6: "No",
	comment_to_q6: "q6-comment",
	id: 77,
	dateOfConstuction: "2020-07-01",
	answers: [
		{
			id: 101,
			level: "L1",
			ans_to_q2: "No",
			comment_to_q2: "q2-comment",
			ans_to_q3: "Yes",
			comment_to_q3: "q3-comment",
			ans_to_q4: "No",
			comment_to_q4: "q4-comment",
		},
		{
			id: 102,
			level: "L2",
			ans_to_q2: "No",
			comment_to_q2: "q2-comment",
			ans_to_q3: "Yes",
			comment_to_q3: "q3-comment",
			ans_to_q4: "No",
			comment_to_q4: "q4-comment",
		},
	],
	libraryName: "Central Supermarket",
	memberCapacity: 1250,
	openLate: true,
	address: {
		city: "Berlin",
		country: "Germany",
	},
});

const formOut = SupermarketCodec.fromInput(serverSample);
SupermarketFormSchema.parse(formOut);

const serverRoundtrip = SupermarketCodec.fromOutput(formOut);
SupermarketServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, serverSample);

const formRoundtrip = SupermarketCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("Supermarket codec roundtrip check passed");
