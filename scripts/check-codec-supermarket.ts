import assert from "node:assert/strict";
import { SupermarketServerSchema } from "../src/consumer-code/batteries/generated/supermarket/server-schema";
import {
	SupermarketCodec,
	SupermarketFormSchema,
} from "../src/consumer-code/batteries/hand-written-codecs/supermarket/reshape-wo-codegen";

const serverSample = SupermarketServerSchema.parse({
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
