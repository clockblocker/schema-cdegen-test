import { z } from "zod";

// Server schemas — booleans
const boolOrUndefined = z.boolean().optional();

export const LoansServerSchema = z.object({
	questionsLoans: z.object({
		q3: boolOrUndefined,
		q4: boolOrUndefined,
	}),
});

export type LoansServer = z.infer<typeof LoansServerSchema>;
