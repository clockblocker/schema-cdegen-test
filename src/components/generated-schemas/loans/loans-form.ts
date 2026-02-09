import { z } from "zod";
import { yesNo, yesNoOrUndefined } from "../types";

export const LoansFormInSchema = z.object({
	questionsLoans: z.object({
		q3: yesNoOrUndefined,
		q4: yesNoOrUndefined,
	}),
});

export const LoansSalesFormOutSchema = z.object({
	questionsLoans: z.object({
		q3: yesNo,
		q4: yesNoOrUndefined,
	}),
});

export const LoansScorerFormOutSchema = z.object({
	questionsLoans: z.object({
		q3: yesNo,
		q4: yesNo,
	}),
});

export type LoansFormIn = z.infer<typeof LoansFormInSchema>;
export type LoansSalesFormOut = z.infer<typeof LoansSalesFormOutSchema>;
export type LoansScorerFormOut = z.infer<typeof LoansScorerFormOutSchema>;
