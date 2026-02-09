import { z } from "zod";
import { yesNo, yesNoOrUndefined } from "../types";
import { LoansServerToForm } from "../../codecs/loans-codecs";

export const LoansFormInSchema = LoansServerToForm;

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
