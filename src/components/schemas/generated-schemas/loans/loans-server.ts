import { z } from "zod";

// Server schemas — booleans
const boolOrUndefined = z.boolean().optional();

export const LoansServerInSchema = z.object({
	questionsLoans: z.object({
		q3: boolOrUndefined,
		q4: boolOrUndefined,
	}),
});

export type LoansServerIn = z.infer<typeof LoansServerInSchema>;
