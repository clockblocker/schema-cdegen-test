import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { SupermarketFormSchema } from "./reshape-wo-codegen";

const supermarketFormValidatedSchema = SupermarketFormSchema.superRefine(
	(formValue, ctx) => {
		if (!formValue.libraryName.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["libraryName"],
				message: "Supermarket name is required.",
			});
		}

		if (!formValue.address.city.trim()) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["address", "city"],
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

const supermarketElectricianValidatedSchema =
	supermarketFormValidatedSchema.refine(
		(formValue) => formValue.questionare.q1.answer === "Yes",
		{
			path: ["questionare", "q1", "answer"],
			message: "Electrician audit requires Question 1 to be Yes.",
		},
	);

const supermarketPlumberValidatedSchema = supermarketFormValidatedSchema.refine(
	(formValue) => formValue.questionare.q2.answer === "Yes",
	{
		path: ["questionare", "q2", "answer"],
		message: "Plumber audit requires Question 2 to be Yes.",
	},
);

export const SupermarketFormValidatedSchemaForRole = {
	Electrician: supermarketElectricianValidatedSchema,
	Plumber: supermarketPlumberValidatedSchema,
} as const satisfies Record<
	UserRole,
	z.ZodType<
		z.output<typeof SupermarketFormSchema>,
		z.ZodTypeDef,
		z.input<typeof SupermarketFormSchema>
	>
>;
