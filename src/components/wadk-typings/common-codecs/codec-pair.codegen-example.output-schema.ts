// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: src/components/wadk-typings/common-codecs/codec-pair.codegen-example.ts
// Codec export: ExampleServerToFormCodec
import { z } from "zod";
export const ExampleFormSchema = z.object({ meta: z.object({ id: z.string(), status: z.enum(["Yes", "No"]) }), financial: z.object({ amountText: z.string().nullable() }), createdAt: z.date().nullable(), tagItems: z.array(z.object({ value: z.string() })), addressLine1: z.string(), countryCode: z.enum(["US", "CA"]).nullable() });

export type ExampleFormSchemaType = z.infer<typeof ExampleFormSchema>;
