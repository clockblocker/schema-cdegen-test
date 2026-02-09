import type z from "zod/v3";
import {
	type ArServer,
	ArServerSchema,
} from "../server/ar-server";
import { boolToYesNo, yesNoToBool } from "./atomic/yesNoAndBool";

export const arServerToForm = (data: ArServer) => ({
	questions: {
		q1: boolToYesNo(data.questions.q1),
		q2: boolToYesNo(data.questions.q2),
	},
});

export const ArFormSchema = ArServerSchema.transform(arServerToForm);
export type ArForm = z.infer<typeof ArFormSchema>;

export const arFormToServer = (data: ArForm): ArServer => ({
	questions: {
		q1: yesNoToBool(data.questions.q1),
		q2: yesNoToBool(data.questions.q2),
	},
});
