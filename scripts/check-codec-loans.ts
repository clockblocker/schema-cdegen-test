import assert from "node:assert/strict";
import { LoansFormSchema } from "../src/consumer-code/batteries/generated/loans/reshape-schema";
import {
	LoansServerSchema,
	LoansServerToFormCodec,
} from "../src/consumer-code/batteries/hand-written-codecs/loans";

const serverSample = LoansServerSchema.parse({
	questionsLoans: {
		q3: true,
		q4: false,
	},
});

const formOut = LoansServerToFormCodec.fromInput(serverSample);
LoansFormSchema.parse(formOut);

const serverRoundtrip = LoansServerToFormCodec.fromOutput(formOut);
LoansServerSchema.parse(serverRoundtrip);

assert.deepStrictEqual(serverRoundtrip, serverSample);

const formRoundtrip = LoansServerToFormCodec.fromInput(serverRoundtrip);
assert.deepStrictEqual(formRoundtrip, formOut);

console.log("Loans codec roundtrip check passed");
