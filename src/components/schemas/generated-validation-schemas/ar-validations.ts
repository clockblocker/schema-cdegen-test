import { z } from "zod";
import { ArFormSchema } from "../codecs/ar-codecs";
import { maxNumericValue } from "../codecs/types";

export const ArSalesFormValidationSchema = ArFormSchema.required({
	q1l0: true,
}).extend({
	q5l0: z.string().max(100),
	q3l0: maxNumericValue(999_999_999).optional(),
	l1: ArFormSchema.shape.l1.extend({
		q5l1: z.string().max(100),
		q3l1: maxNumericValue(999_999_999).optional(),
		l2: ArFormSchema.shape.l1.shape.l2.extend({
			q5l2: z.string().max(100),
			q3l2: maxNumericValue(999_999_999).optional(),
		}),
	}),
});

export const ArScorerFormValidationSchema =
	ArSalesFormValidationSchema.required({ q2l0: true });

export type ArSalesFormValidated = z.infer<typeof ArSalesFormValidationSchema>;
export type ArScorerFormValidated = z.infer<
	typeof ArScorerFormValidationSchema
>;
