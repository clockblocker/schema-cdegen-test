import { z } from "zod";
import { yesNoOrUndefined } from "../types";

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
