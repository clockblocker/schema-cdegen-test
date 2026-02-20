// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const LibraryServerSchema = z.object({
	ans_to_q1: z.string(),
	comment_to_q1_: z.string(),
	id: z.number(),
	dateOfConstuction: z.string(),
	answers: z.array(
		z.object({
			ans_to_q2: z.string(),
			comment_to_q2_: z.string(),
		}),
	),
	libraryName: z.string(),
	memberCapacity: z.number().optional(),
	openLate: boolOrUndefined,
	address: z.object({
		city: z.string(),
		country: z.string(),
	}),
});

export type LibraryServer = z.infer<typeof LibraryServerSchema>;
