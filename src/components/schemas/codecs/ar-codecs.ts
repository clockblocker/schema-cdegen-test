import type { z } from "zod";
import { ArServerSchema } from "../server/ar-server";
import { dateIso } from "./atomic/date-and-isoString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import { buildCodec } from "./build-codec";

const ar = buildCodec(ArServerSchema, {
	q1l0: yesNoBool,
	q2l0: yesNoBool,
	q3l0: stringNumber,
	q4l0: dateIso,
	q5l0: nullishEmpty,
	l1: {
		q1l1: yesNoBool,
		q2l1: yesNoBool,
		q3l1: stringNumber,
		q4l1: dateIso,
		q5l1: nullishEmpty,
		l2: {
			q1l2: yesNoBool,
			q2l2: yesNoBool,
			q3l2: stringNumber,
			q4l2: dateIso,
			q5l2: nullishEmpty,
		},
	},
});

export const ArFormSchema = ar.formSchema;
export const arServerToForm = ar.toForm;
export const arFormToServer = ar.toServer;
export const ArFormCodec = ar.codec;
export type ArForm = z.infer<typeof ArFormSchema>;
