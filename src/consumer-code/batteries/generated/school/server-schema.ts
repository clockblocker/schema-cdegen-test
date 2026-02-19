// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const SchoolServerSchema = z.object({
	questionsSchool: z.object({
		q3: boolOrUndefined,
		q4: boolOrUndefined,
	}),
});

export type SchoolServer = z.infer<typeof SchoolServerSchema>;
