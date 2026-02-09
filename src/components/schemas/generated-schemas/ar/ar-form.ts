import { z } from "zod";
import { yesNo, yesNoOrUndefined } from "../types";
import { ArServerToForm } from "../../codecs/ar-codecs";

export const ArFormInSchema = ArServerToForm;

export const ArSalesFormOutSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNoOrUndefined,
	}),
});

export const ArScorerFormOutSchema = z.object({
	questions: z.object({
		q1: yesNo,
		q2: yesNo,
	}),
});

export type ArFormIn = z.infer<typeof ArFormInSchema>;
export type ArSalesFormOut = z.infer<typeof ArSalesFormOutSchema>;
export type ArScorerFormOut = z.infer<typeof ArScorerFormOutSchema>;
