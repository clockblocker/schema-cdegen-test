import type { z } from "zod";
import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { HospitalServerSchema } from "../server/hospital-server";

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

const hospital = buildAddaptersAndOutputSchema(HospitalServerSchema, {
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

export const HospitalFormSchema = hospital.outputSchema;
export const hospitalServerToForm = hospital.fromInput;
export const hospitalFormToServer = hospital.fromOutput;
export type HospitalForm = z.infer<typeof HospitalFormSchema>;
