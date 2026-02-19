// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/consumer-code/adapters/hand-written-codecs/reshape/index.ts
// Codec export: ReshapeServerToPartiesCodec
import { z } from "zod";
export const ReshapeOutputSchema = z.object({ l0_f0: z.date(), parties: z.array(z.union([z.object({ id: z.number(), l1_f0: z.date() }), z.object({ id: z.number(), l2_f0: z.date() })])) });

export type ReshapeOutputSchemaType = z.infer<typeof ReshapeOutputSchema>;
