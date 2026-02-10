import type { z } from "zod";
import { LoansServerSchema } from "../server/loans-server";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import { buildCodec } from "./build-codec";

const loans = buildCodec(LoansServerSchema, {
	questionsLoans: {
		q3: yesNoBool,
		q4: yesNoBool,
	},
});

export const LoansFormSchema = loans.formSchema;
export const loansServerToForm = loans.toForm;
export const loansFormToServer = loans.toServer;
export const LoansFormCodec = loans.codec;
export type LoansForm = z.infer<typeof LoansFormSchema>;
