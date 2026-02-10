import { z } from "zod";
import { type ArServer, ArServerSchema } from "../server/ar-server";
import { dateToIsoString, isoStringToDate } from "./atomic/date-and-isoString";
import { emptyToNullish, nullishToEmpty } from "./atomic/nullish-and-empty";
import { numberToString, stringToNumber } from "./atomic/string-and-number";
import { boolToYesNo, yesNoToBool } from "./atomic/yesNo-and-bool";
import {
	dateValueOrUndefined,
	nonNullishString,
	numericStringOrUndefined,
	yesNoOrUndefined,
} from "./types";

export const arServerToForm = (data: ArServer) => ({
	questions: {
		q1: boolToYesNo(data.questions.q1),
		q2: boolToYesNo(data.questions.q2),
		q3: numberToString(data.questions.q3),
		q4: isoStringToDate(data.questions.q4),
		q5: nullishToEmpty(data.questions.q5),
	},
});

export const ArFormSchema = z.object({
	questions: z.object({
		q1: yesNoOrUndefined,
		q2: yesNoOrUndefined,
		q3: numericStringOrUndefined,
		q4: dateValueOrUndefined,
		q5: nonNullishString,
	}),
});

export const ArFormCodec =
	ArServerSchema.transform(arServerToForm).pipe(ArFormSchema);
export type ArForm = z.infer<typeof ArFormSchema>;

export const arFormToServer = (data: ArForm): ArServer => ({
	questions: {
		q1: yesNoToBool(data.questions.q1),
		q2: yesNoToBool(data.questions.q2),
		q3: stringToNumber(data.questions.q3),
		q4: dateToIsoString(data.questions.q4),
		q5: emptyToNullish(data.questions.q5),
	},
});
