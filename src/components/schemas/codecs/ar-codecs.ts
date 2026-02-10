import type { z } from "zod";
import { ArServerSchema } from "../server/ar-server";
import { dateIso } from "./atomic/date-and-isoString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import { buildCodec } from "./build-codec";

const ar = buildCodec(ArServerSchema, {
	questions: {
		q1: yesNoBool,
		q2: yesNoBool,
		q3: stringNumber,
		q4: dateIso,
		q5: nullishEmpty,
	},
});

export const ArFormSchema = ar.formSchema;
export const arServerToForm = ar.toForm;
export const arFormToServer = ar.toServer;
export const ArFormCodec = ar.codec;
export type ArForm = z.infer<typeof ArFormSchema>;
