import type z from "zod/v3";
import { ArFormShape } from "../codecs/ar-codecs";

export const ArSalesFormValidationSchema = ArFormShape.extend({
	questions: ArFormShape.shape.questions.required({ q1: true }),
});

export const ArScorerFormValidationSchema = ArSalesFormValidationSchema.extend({
	questions: ArSalesFormValidationSchema.shape.questions.required({ q2: true }),
});

export type ArSalesFormValidated = z.infer<typeof ArSalesFormValidationSchema>;
export type ArScorerFormValidated = z.infer<
	typeof ArScorerFormValidationSchema
>;
