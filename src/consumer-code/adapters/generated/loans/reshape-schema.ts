// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/adapters/hand-written-codecs/loans/index.ts
// Codec export: LoansServerToFormCodec
import { z } from "zod";
/*
Codegen warnings:
- Property "q3" has no declaration; using z.unknown().
- Property "q4" has no declaration; using z.unknown().
*/

export const LoansFormSchema = z.object({ questions: z.object({ "q3": z.unknown(), "q4": z.unknown() }) });

export type LoansFormSchemaType = z.infer<typeof LoansFormSchema>;
