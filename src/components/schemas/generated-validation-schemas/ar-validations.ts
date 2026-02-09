import { z } from "zod";
import { yesNo, yesNoOrUndefined } from "../codecs/types";

export const ArSalesFormValidationSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNoOrUndefined,
	}),
});

export const ArScorerFormValidationSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNo,
	}),
});

export type ArSalesFormValidated = z.infer<typeof ArSalesFormValidationSchema>;
export type ArScorerFormValidated = z.infer<
	typeof ArScorerFormValidationSchema
>;
