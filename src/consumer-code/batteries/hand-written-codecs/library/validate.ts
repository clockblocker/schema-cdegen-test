import { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { LibraryFormSchema } from "./reshape-wo-codegen";

const LIB_Q01_YES_ANSWER_ID = "LIB_Q01_A01";
const LIB_Q02_YES_ANSWER_IDS = new Set(["LIB_Q02_A01", "LIB_Q02_A03"]);

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

		if (formValue.questionare.answers.LIB_Q01.answer === null) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionare", "answers", "LIB_Q01", "answer"],
				message: "Question 1 answer is required.",
			});
		}

		if (formValue.questionare.answers.LIB_Q02.answer === null) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ["questionare", "answers", "LIB_Q02", "answer"],
				message: "Question 2 answer is required.",
			});
		}
	},
);

const libraryElectricianValidatedSchema = libraryFormValidatedSchema.refine(
	(formValue) =>
		formValue.questionare.answers.LIB_Q01.answer === LIB_Q01_YES_ANSWER_ID,
	{
		path: ["questionare", "answers", "LIB_Q01", "answer"],
		message: "Electrician audit requires Question 1 to be Yes.",
	},
);

const libraryPlumberValidatedSchema = libraryFormValidatedSchema.refine(
	(formValue) => {
		const q2Answer = formValue.questionare.answers.LIB_Q02.answer;
		return typeof q2Answer === "string" && LIB_Q02_YES_ANSWER_IDS.has(q2Answer);
	},
	{
		path: ["questionare", "answers", "LIB_Q02", "answer"],
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
