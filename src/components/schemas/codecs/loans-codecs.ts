import type { z } from "zod";
import { LoansServerSchema } from "../server/loans-server";
import { atomicCodecs } from "./atomic";
import { buildCodec } from "./build-codec";

const loans = buildCodec(LoansServerSchema, {
	questionsLoans: {
		q3: atomicCodecs.yesNoBool,
		q4: atomicCodecs.yesNoBool,
	},
});

export const LoansFormSchema = loans.formSchema;
export const loansServerToForm = loans.toForm;
export const loansFormToServer = loans.toServer;
export const LoansFormCodec = loans.codec;
export type LoansForm = z.infer<typeof LoansFormSchema>;
