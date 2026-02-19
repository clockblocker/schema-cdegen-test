// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/batteries/hand-written-codecs/school/index.ts
// Codec export: SchoolServerToFormCodec
import { z } from "zod";
export const SchoolFormSchema = z.object({
	questions: z.object({
		q3: z.enum(["Yes", "No"]).optional(),
		q4: z.enum(["Yes", "No"]).optional(),
	}),
});

export type SchoolFormSchemaType = z.infer<typeof SchoolFormSchema>;
