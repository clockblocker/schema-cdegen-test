import { z } from "zod";
import { yesNoOrUndefined } from "../types";

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
