import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { HospitalFormSchema } from "../../generated/hospital/reshape-schema";

const hospitalFormValidatedSchema = HospitalFormSchema.extend({
	l0: HospitalFormSchema.shape.l0.extend({
		q5: HospitalFormSchema.shape.l0.shape.q5.max(
			64,
			"L0 Q5 must be at most 64 characters.",
		),
	}),
}).superRefine((formValue, ctx) => {
	if (formValue.l0.q2 === undefined) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["l0", "q2"],
			message: "L0 Q2 is required.",
		});
	}

	if (formValue.l1.q3l1 === undefined) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["l1", "q3l1"],
			message: "L1 Q3 is required.",
		});
	}
});

const hospitalElectricianValidatedSchema =
	hospitalFormValidatedSchema.superRefine((formValue, ctx) => {
		if (formValue.l0.q4 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["l0", "q4"],
				message: "Electrician audit requires L0 Q4.",
			});
		}

		if (formValue.l1.q4l1 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["l1", "q4l1"],
				message: "Electrician audit requires L1 Q4.",
			});
		}
	});

const hospitalPlumberValidatedSchema = hospitalFormValidatedSchema.superRefine(
	(formValue, ctx) => {
		if (formValue.l0.q3 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["l0", "q3"],
				message: "Plumber audit requires L0 Q3.",
			});
		}

		if (formValue.l1.q1l1 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["l1", "q1l1"],
				message: "Plumber audit requires L1 Q1.",
			});
		}
	},
);

export const HospitalFormValidatedSchemaForRole = {
	Electrician: hospitalElectricianValidatedSchema,
	Plumber: hospitalPlumberValidatedSchema,
} as const satisfies Record<
	UserRole,
	z.ZodType<
		z.output<typeof HospitalFormSchema>,
		any,
		z.input<typeof HospitalFormSchema>
	>
>;
