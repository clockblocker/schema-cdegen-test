import { HospitalFormSchema } from "../../generated/hospital/reshape-schema";

const hospitalL0ValidatedSchema = HospitalFormSchema.shape.l0
	.required({
		q2: true,
	})
	.extend({
		q5: HospitalFormSchema.shape.l0.shape.q5.max(
			64,
			"L0 Q5 must be at most 64 characters.",
		),
	});

const hospitalL1ValidatedSchema = HospitalFormSchema.shape.l1.required({
	q3l1: true,
});

export const HospitalFormValidatedSchema = HospitalFormSchema.extend({
	l0: hospitalL0ValidatedSchema,
	l1: hospitalL1ValidatedSchema,
});
