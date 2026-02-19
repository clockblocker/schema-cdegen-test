// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/batteries/hand-written-codecs/ar/index.ts
// Codec export: ArServerToFormCodec
import { z } from "zod";
export const ArFormSchema = z.object({ l0: z.object({ q1: z.boolean().optional(), q2: z.enum(["Yes", "No"]).optional(), q3: z.string().optional(), q4: z.date().optional(), q5: z.string() }), l1: z.object({ q1l1: z.enum(["Yes", "No"]).optional(), q2l1: z.enum(["Yes", "No"]).optional(), q3l1: z.string().optional(), q4l1: z.date().optional(), q5l1: z.string(), l2: z.object({ q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional(), q5l2: z.string() }), l2_arr: z.array(z.object({ q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional(), q5l2: z.string(), l3_arr: z.array(z.object({ q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional(), q5l2: z.string() })) })) }) });

export type ArFormSchemaType = z.infer<typeof ArFormSchema>;
