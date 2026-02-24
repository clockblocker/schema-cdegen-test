// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const AnswerLevelSchema = z.enum(["L1", "L2"]);
export const AnswerSchema = z.object({
	id: z.number(),
	level: AnswerLevelSchema,
	sm_lvl_q02_answer: z.string(),
	sm_lvl_q02_comment: z.string(),
	sm_lvl_q03_answer: z.string(),
	sm_lvl_q03_comment: z.string(),
	sm_lvl_q04_answer: z.string(),
	sm_lvl_q04_comment: z.string(),
});

export const SupermarketServerSchema = z.object({
	sm_q01_answer: z.string(),
	sm_q01_comment: z.string(),
	sm_q05_answer: z.string(),
	sm_q05_comment: z.string(),
	sm_q06_answer: z.string(),
	sm_q06_comment: z.string(),
	sm_q07_answer: z.string(),
	sm_q07_comment: z.string(),
	sm_q08_answer: z.string(),
	sm_q08_comment: z.string(),
	sm_q09_answer: z.string(),
	sm_q09_comment: z.string(),
	sm_q10_answer: z.string(),
	sm_q10_comment: z.string(),
	sm_q11_answer: z.string(),
	sm_q11_comment: z.string(),

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
