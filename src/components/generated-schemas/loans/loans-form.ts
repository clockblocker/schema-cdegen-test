import { z } from "zod";
import { yesNoOrUndefined, boolToYesNo, yesNoToBool } from "../types";
import { LoansServerInSchema, type LoansServerIn } from "./loans-server";

export const LoansFormInSchema = z.object({
	questionsLoans: z.object({
		q3: yesNoOrUndefined,
		q4: yesNoOrUndefined,
	}),
});

export const LoansSalesFormOutSchema = LoansFormInSchema.extend({
	questionsLoans: LoansFormInSchema.shape.questionsLoans.required({ q3: true }),
});

export const LoansScorerFormOutSchema = LoansSalesFormOutSchema.extend({
	questionsLoans: LoansSalesFormOutSchema.shape.questionsLoans.required({ q4: true }),
});

export type LoansFormIn = z.infer<typeof LoansFormInSchema>;
export type LoansSalesFormOut = z.infer<typeof LoansSalesFormOutSchema>;
export type LoansScorerFormOut = z.infer<typeof LoansScorerFormOutSchema>;

// decode: server → form (for loading)
export const LoansServerToForm = LoansServerInSchema.transform((data): LoansFormIn => ({
	questionsLoans: {
		q3: boolToYesNo(data.questionsLoans.q3),
		q4: boolToYesNo(data.questionsLoans.q4),
	},
}));

// encode: form → server (for submitting)
export const LoansFormToServer = LoansFormInSchema.transform((data): LoansServerIn => ({
	questionsLoans: {
		q3: yesNoToBool(data.questionsLoans.q3),
		q4: yesNoToBool(data.questionsLoans.q4),
	},
}));
