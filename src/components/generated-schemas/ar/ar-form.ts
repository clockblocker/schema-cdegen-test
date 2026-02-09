import { z } from "zod";
import { yesNoOrUndefined, boolToYesNo, yesNoToBool } from "../types";
import { ArServerInSchema, type ArServerIn } from "./ar-server";

export const ArFormInSchema = z.object({
	questions: z.object({
		q1: yesNoOrUndefined,
		q2: yesNoOrUndefined,
	}),
});

export const ArSalesFormOutSchema = ArFormInSchema.extend({
	questions: ArFormInSchema.shape.questions.required({ q1: true }),
});

export const ArScorerFormOutSchema = ArSalesFormOutSchema.extend({
	questions: ArSalesFormOutSchema.shape.questions.required({ q2: true }),
});

export type ArFormIn = z.infer<typeof ArFormInSchema>;
export type ArSalesFormOut = z.infer<typeof ArSalesFormOutSchema>;
export type ArScorerFormOut = z.infer<typeof ArScorerFormOutSchema>;

// decode: server → form (for loading)
export const ArServerToForm = ArServerInSchema.transform((data): ArFormIn => ({
	questions: {
		q1: boolToYesNo(data.questions.q1),
		q2: boolToYesNo(data.questions.q2),
	},
}));

// encode: form → server (for submitting)
export const ArFormToServer = ArFormInSchema.transform((data): ArServerIn => ({
	questions: {
		q1: yesNoToBool(data.questions.q1),
		q2: yesNoToBool(data.questions.q2),
	},
}));
