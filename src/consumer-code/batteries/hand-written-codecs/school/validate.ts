import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { SchoolFormSchema } from "../../generated/school/reshape-schema";

const schoolFormValidatedSchema = SchoolFormSchema.superRefine(
	(formValue, ctx) => {
		if (formValue.questions.q3 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questions", "q3"],
				message: "Question 3 is required.",
			});
		}

		if (formValue.questions.q4 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questions", "q4"],
				message: "Question 4 is required.",
			});
		}
	},
);

const schoolElectricianValidatedSchema = schoolFormValidatedSchema.refine(
	(formValue) => formValue.questions.q3 === "Yes",
	{
		path: ["questions", "q3"],
		message: "Electrician audit requires Question 3 to be Yes.",
	},
);

const schoolPlumberValidatedSchema = schoolFormValidatedSchema.refine(
	(formValue) => formValue.questions.q4 === "Yes",
	{
		path: ["questions", "q4"],
		message: "Plumber audit requires Question 4 to be Yes.",
	},
);

export const SchoolFormValidatedSchemaForRole = {
	Electrician: schoolElectricianValidatedSchema,
	Plumber: schoolPlumberValidatedSchema,
} as const satisfies Record<
	UserRole,
	z.ZodType<
		z.output<typeof SchoolFormSchema>,
		any,
		z.input<typeof SchoolFormSchema>
	>
>;
