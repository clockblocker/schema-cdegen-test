import { z } from "zod";
import { maxNumericValue } from "~/lib/codec-builder-library/adapter-builder/shitty-input-schemas";
import { HospitalFormSchema } from "../codecs/hospital-codecs";

const HospitalFormWithLimitsSchema = HospitalFormSchema.extend({
	q5l0: z.string().max(100),
	q3l0: maxNumericValue(999_999_999),
	l1: HospitalFormSchema.shape.l1.extend({
		q5l1: z.string().max(100),
		q3l1: maxNumericValue(999_999_999),
		l2: HospitalFormSchema.shape.l1.shape.l2.extend({
			q5l2: z.string().max(100),
			q3l2: maxNumericValue(999_999_999),
		}),
	}),
});

export const HospitalSalesFormValidationSchema =
	HospitalFormWithLimitsSchema.required({
		q1l0: true,
	});

export const HospitalScorerFormValidationSchema =
	HospitalFormWithLimitsSchema.required({
		q2l0: true,
	});

export type HospitalSalesFormValidated = z.infer<
	typeof HospitalSalesFormValidationSchema
>;
export type HospitalScorerFormValidated = z.infer<
	typeof HospitalScorerFormValidationSchema
>;
