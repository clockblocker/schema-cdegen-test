import { z } from "zod";
import { yesNo, yesNoOrUndefined } from "../codecs/types";

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

export type LoansSalesFormOut = z.infer<typeof LoansSalesFormOutSchema>;
export type LoansScorerFormOut = z.infer<typeof LoansScorerFormOutSchema>;
