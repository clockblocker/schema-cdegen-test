import type z from "zod/v3";
import { ArFormSchema } from "../codecs/ar-codecs";

export const ArSalesFormValidationSchema = ArFormSchema.required({ q1l0: true });

export const ArScorerFormValidationSchema = ArSalesFormValidationSchema.required({ q2l0: true });

export type ArSalesFormValidated = z.infer<typeof ArSalesFormValidationSchema>;
export type ArScorerFormValidated = z.infer<
	typeof ArScorerFormValidationSchema
>;
