import type { UserRole } from "~/consumer-code/business-types";
import { z } from "zod";
import { SchoolFormValidatedSchema } from "./form-validated-schema";

const schoolElectricianValidatedSchema = SchoolFormValidatedSchema.refine(
	(formValue) => formValue.questions.q3 === "Yes",
	{
		path: ["questions", "q3"],
		message: "Electrician audit requires Question 3 to be Yes.",
	},
);

const schoolPlumberValidatedSchema = SchoolFormValidatedSchema.refine(
	(formValue) => formValue.questions.q4 === "Yes",
	{
		path: ["questions", "q4"],
		message: "Plumber audit requires Question 4 to be Yes.",
	},
);

export const SchoolFormValidatedSchemaForRole = {
	Electrician: schoolElectricianValidatedSchema,
	Plumber: schoolPlumberValidatedSchema,
} as const satisfies Record<UserRole, z.ZodTypeAny>;
