import { LoansFormSchema } from "../../adapters/generated/loans/reshape-schema";
import { LoansServerToFormCodec } from "../../adapters/hand-written-codecs/loans";

export const loansRHF = {
	flavor: "Loans" as const,
	schema: LoansFormSchema,
	fromServer: LoansServerToFormCodec.fromInput,
	toServer: LoansServerToFormCodec.fromOutput,
};

export type LoansServerInput = Parameters<typeof loansRHF.fromServer>[0];
export type LoansFormOutput = ReturnType<typeof loansRHF.fromServer>;
