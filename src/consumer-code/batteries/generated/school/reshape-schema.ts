// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/batteries/batteries.ts
// Codec export: SchoolServerToFormCodec
import { z } from "zod";
export const SchoolFormSchema = z.object({ questionsSchool: z.object({ q3: z.enum(["Yes", "No"]).optional(), q4: z.enum(["Yes", "No"]).optional() }), classrooms: z.object({ wallColor: z.string(), ids: z.array(z.number()) }) });

export type SchoolFormSchemaType = z.infer<typeof SchoolFormSchema>;
