// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/adapters/hand-written-codecs/ar/index.ts
// Codec export: ArServerToFormCodec
import { z } from "zod";
/*
Codegen warnings:
- Property "q5l1" has no declaration; using z.unknown().
- Property "l2" has no declaration; using z.unknown().
- Property "l2_arr" has no declaration; using z.unknown().
- Property "q1l1" has no declaration; using z.unknown().
- Property "q2l1" has no declaration; using z.unknown().
- Property "q3l1" has no declaration; using z.unknown().
- Property "q4l1" has no declaration; using z.unknown().
*/

export const ArFormSchema = z.object({ l0: z.object({ q1: z.boolean().optional(), q2: z.enum(["Yes", "No"]).optional(), q3: z.string().optional(), q4: z.date().optional(), q5: z.string() }), l1: z.object({ "q5l1": z.unknown(), "l2": z.unknown(), "l2_arr": z.unknown(), "q1l1": z.unknown(), "q2l1": z.unknown(), "q3l1": z.unknown(), "q4l1": z.unknown() }) });

export type ArFormSchemaType = z.infer<typeof ArFormSchema>;
