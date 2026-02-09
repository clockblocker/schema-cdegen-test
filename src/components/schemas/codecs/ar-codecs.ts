import { z } from "zod";
import { boolToYesNo, yesNoOrUndefined } from "../generated-schemas/types";
import { yesNoToBool } from "./atomic/yesNoToBool";
import { ArServerInSchema, type ArServerIn } from "../generated-schemas/ar/ar-server";

export const ArServerToForm = ArServerInSchema.transform((data) => ({
	questions: {
		q1: boolToYesNo(data.questions.q1),
		q2: boolToYesNo(data.questions.q2),
	},
}));

export const ArFormToServer = z.object({
	questions: z.object({
		q1: yesNoOrUndefined,
		q2: yesNoOrUndefined,
	}),
}).transform((data): ArServerIn => ({
	questions: {
		q1: yesNoToBool(data.questions.q1),
		q2: yesNoToBool(data.questions.q2),
	},
}));
