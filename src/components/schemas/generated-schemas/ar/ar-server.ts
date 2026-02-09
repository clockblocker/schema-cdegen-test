import { z } from "zod";

// Server schemas — booleans
const boolOrUndefined = z.boolean().optional();

export const ArServerInSchema = z.object({
	questions: z.object({
		q1: boolOrUndefined,
		q2: boolOrUndefined,
	}),
});

export type ArServerIn = z.infer<typeof ArServerInSchema>;
