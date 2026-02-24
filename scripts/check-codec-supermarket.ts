import assert from "node:assert/strict";
import { SupermarketServerSchema } from "../src/consumer-code/batteries/generated/supermarket/server-schema";
import {
	SupermarketCodec,
	SupermarketFormSchema,
} from "../src/consumer-code/batteries/hand-written-codecs/supermarket/reshape-wo-codegen";

const serverSample = SupermarketServerSchema.parse({
	sm_q01_answer: "SM1_A01",
	sm_q01_comment: "q1-comment",
	sm_q05_answer: "SM2_B01",
	sm_q05_comment: "q5-comment",
	sm_q06_answer: "SM2_C01",
	sm_q06_comment: "q6-comment",
	sm_q07_answer: "SM3_A01",
	sm_q07_comment: "q7-comment",
	sm_q08_answer: "SM3_B01",
	sm_q08_comment: "q8-comment",
	sm_q09_answer: "SM3_C01",
	sm_q09_comment: "q9-comment",
	sm_q10_answer: "SM4_A01",
	sm_q10_comment: "q10-comment",
	sm_q11_answer: "SM4_B01",
	sm_q11_comment: "q11-comment",
	id: 77,
	dateOfConstuction: "2020-07-01",
	answers: [
		{
			id: 101,
			level: "L1",
			sm_lvl_q02_answer: "SM1_B01",
			sm_lvl_q02_comment: "q2-comment",
			sm_lvl_q03_answer: "SM1_C01",
			sm_lvl_q03_comment: "q3-comment",
			sm_lvl_q04_answer: "SM2_A01",
			sm_lvl_q04_comment: "q4-comment",
		},
		{
			id: 102,
			level: "L2",
			sm_lvl_q02_answer: "SM1_B01",
			sm_lvl_q02_comment: "q2-comment",
			sm_lvl_q03_answer: "SM1_C01",
			sm_lvl_q03_comment: "q3-comment",
			sm_lvl_q04_answer: "SM2_A01",
			sm_lvl_q04_comment: "q4-comment",
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
