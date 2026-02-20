import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { SchoolFormSchema } from "./adapt-fields";

const schoolFormValidatedSchema = SchoolFormSchema.superRefine(
	(formValue, ctx) => {
		if (formValue.questionsSchool.q3 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionsSchool", "q3"],
				message: "Question 3 is required.",
			});
		}

		if (formValue.questionsSchool.q4 === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionsSchool", "q4"],
				message: "Question 4 is required.",
			});
		}
	},
);

const schoolElectricianValidatedSchema = schoolFormValidatedSchema.refine(
	(formValue) => formValue.questionsSchool.q3 === "Yes",
	{
		path: ["questionsSchool", "q3"],
		message: "Electrician audit requires Question 3 to be Yes.",
	},
);

const schoolPlumberValidatedSchema = schoolFormValidatedSchema.refine(
	(formValue) => formValue.questionsSchool.q4 === "Yes",
	{
		path: ["questionsSchool", "q4"],
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
