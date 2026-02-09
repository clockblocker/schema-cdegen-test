import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const ServerInSchema = z.object({
	questions: z.object({
		q1: boolOrUndefined,
		q2: boolOrUndefined,
	}),
});

export const ServerOutSchema = z.object({
	questions: z.object({
		q1: z.boolean(),
		q2: boolOrUndefined,
	}),
});

export type ServerIn = z.infer<typeof ServerInSchema>;
export type ServerOut = z.infer<typeof ServerOutSchema>;
