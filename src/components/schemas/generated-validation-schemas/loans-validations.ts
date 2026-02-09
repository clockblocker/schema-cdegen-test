import type z from "zod/v3";
import { LoansFormShape } from "../codecs/loans-codecs";

export const LoansSalesFormOutSchema = LoansFormShape.extend({
	questionsLoans: LoansFormShape.shape.questionsLoans.required({ q3: true }),
});

export const LoansScorerFormOutSchema = LoansSalesFormOutSchema.extend({
	questionsLoans: LoansSalesFormOutSchema.shape.questionsLoans.required({ q4: true }),
});

export type LoansSalesFormOut = z.infer<typeof LoansSalesFormOutSchema>;
export type LoansScorerFormOut = z.infer<typeof LoansScorerFormOutSchema>;
