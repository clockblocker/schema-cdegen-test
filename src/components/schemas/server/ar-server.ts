import { z } from "zod";

// Server schemas — booleans
const boolOrUndefined = z.boolean().optional();

export const ArServerSchema = z.object({
	questions: z.object({
		q1: boolOrUndefined,
		q2: boolOrUndefined,
		q3: z.number().optional(),
		q4: z.string().optional(),
		q5: z.string().nullish(),
	}),
});

export type ArServer = z.infer<typeof ArServerSchema>;
