// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/batteries/batteries.ts
// Codec export: HospitalServerToFormCodec
import { z } from "zod";
export const HospitalFormSchema = z.object({ l0: z.object({ q1: z.boolean().optional(), q2: z.enum(["Yes", "No"]).optional(), q3: z.string().optional(), q4: z.date().optional(), q5: z.string() }), l1: z.object({ q5l1: z.string(), l2: z.object({ q5l2: z.string(), q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional() }), l2_arr: z.array(z.object({ q5l2: z.string(), l3_arr: z.array(z.object({ q5l2: z.string(), q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional() })), q1l2: z.enum(["Yes", "No"]).optional(), q2l2: z.enum(["Yes", "No"]).optional(), q3l2: z.string().optional(), q4l2: z.date().optional() })), q1l1: z.enum(["Yes", "No"]).optional(), q2l1: z.enum(["Yes", "No"]).optional(), q3l1: z.string().optional(), q4l1: z.date().optional() }) });

export type HospitalFormSchemaType = z.infer<typeof HospitalFormSchema>;
