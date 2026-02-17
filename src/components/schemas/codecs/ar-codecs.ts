import type { z } from "zod";
import { atomicCodecs } from "~/components/wadk-typings/common-codecs";
import { buildCodecAndFormSchema } from "../../wadk-typings/common-codecs/build-codec";
import { ArServerSchema } from "../server/ar-server";

const { yesNoBool, stringNumber, dateIso, nullishEmpty, noOpCodec, arrayOf } =
	atomicCodecs;

const l2 = {
	q1l2: yesNoBool,
	q2l2: yesNoBool,
	q3l2: stringNumber,
	q4l2: dateIso,
	q5l2: nullishEmpty,
};

const l2ArrItem = {
	q1l2: yesNoBool,
	q2l2: yesNoBool,
	q3l2: stringNumber,
	q4l2: dateIso,
	q5l2: nullishEmpty,
	l3_arr: arrayOf(l2),
};

const ar = buildCodecAndFormSchema(ArServerSchema, {
	q1l0: noOpCodec,
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
		l2,
		l2_arr: arrayOf(l2ArrItem),
	},
});

export const ArFormSchema = ar.outputSchema;
export const arServerToForm = ar.fromInput;
export const arFormToServer = ar.fromOutput;
export type ArForm = z.infer<typeof ArFormSchema>;
