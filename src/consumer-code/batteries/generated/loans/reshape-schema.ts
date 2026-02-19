// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/batteries/hand-written-codecs/loans/index.ts
// Codec export: LoansServerToFormCodec
import { z } from "zod";
export const LoansFormSchema = z.object({ questions: z.object({ q3: z.enum(["Yes", "No"]).optional(), q4: z.enum(["Yes", "No"]).optional() }) });

export type LoansFormSchemaType = z.infer<typeof LoansFormSchema>;
