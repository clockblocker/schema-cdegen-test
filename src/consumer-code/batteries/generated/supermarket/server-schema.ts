// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const AnswerLevelSchema = z.enum(["L1", "L2"]);
export const AnswerSchema = z.object({
	id: z.number(),
	level: AnswerLevelSchema,
	ans_to_q2: z.string(),
	comment_to_q2: z.string(),
	ans_to_q3: z.string(),
	comment_to_q3: z.string(),
	ans_to_q4: z.string(),
	comment_to_q4: z.string(),
});

export const SupermarketServerSchema = z.object({
	ans_to_q1: z.string(),
	comment_to_q1: z.string(),
	ans_to_q5: z.string(),
	comment_to_q5: z.string(),
	ans_to_q6: z.string(),
	comment_to_q6: z.string(),

	id: z.number(),
	dateOfConstuction: z.string(),
	answers: z.array(AnswerSchema),
	libraryName: z.string(),
	memberCapacity: z.number().optional(),
	openLate: boolOrUndefined,
	address: z.object({
		city: z.string(),
		country: z.string(),
	}),
});

export type SupermarketServer = z.infer<typeof SupermarketServerSchema>;
