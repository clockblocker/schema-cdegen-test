import { z } from "zod";

// Server schemas — booleans
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

// Form schemas — "Yes" / "No" / undefined
const yesNo = z.enum(["Yes", "No"]);
const yesNoOrUndefined = yesNo.optional();

export const FormInSchema = z.object({
	questions: z.object({
		q1: yesNoOrUndefined,
		q2: yesNoOrUndefined,
	}),
});

export const SalesFormOutSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNoOrUndefined,
	}),
});

export const ScorerFormOutSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNo,
	}),
});

export type ServerIn = z.infer<typeof ServerInSchema>;
export type ServerOut = z.infer<typeof ServerOutSchema>;
export type FormIn = z.infer<typeof FormInSchema>;
export type SalesFormOut = z.infer<typeof SalesFormOutSchema>;
export type ScorerFormOut = z.infer<typeof ScorerFormOutSchema>;
