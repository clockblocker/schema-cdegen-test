import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { LibraryFormSchema } from "./adapt-fields";

const libraryFormValidatedSchema = LibraryFormSchema.superRefine(
	(formValue, ctx) => {
		if (!formValue.libraryName.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["libraryName"],
				message: "Library name is required.",
			});
		}

		if (!formValue.city.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["city"],
				message: "City is required.",
			});
		}

		if (formValue.questionare.q1.answer === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionare", "q1", "answer"],
				message: "Question 1 answer is required.",
			});
		}

		if (formValue.questionare.q2.answer === undefined) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionare", "q2", "answer"],
				message: "Question 2 answer is required.",
			});
		}
	},
);

const libraryElectricianValidatedSchema = libraryFormValidatedSchema.refine(
	(formValue) => formValue.questionare.q1.answer === "Yes",
	{
		path: ["questionare", "q1", "answer"],
		message: "Electrician audit requires Question 1 to be Yes.",
	},
);

const libraryPlumberValidatedSchema = libraryFormValidatedSchema.refine(
	(formValue) => formValue.questionare.q2.answer === "Yes",
	{
		path: ["questionare", "q2", "answer"],
		message: "Plumber audit requires Question 2 to be Yes.",
	},
);

export const LibraryFormValidatedSchemaForRole = {
	Electrician: libraryElectricianValidatedSchema,
	Plumber: libraryPlumberValidatedSchema,
} as const satisfies Record<
	UserRole,
	z.ZodType<
		z.output<typeof LibraryFormSchema>,
		z.ZodTypeDef,
		z.input<typeof LibraryFormSchema>
	>
>;
