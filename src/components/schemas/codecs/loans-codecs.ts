import type { z } from "zod";
import { atomicCodecs } from "~/components/wadk-typings/common-codecs";
import { buildCodecAndFormSchema } from "../../wadk-typings/common-codecs/build-codec";
import { LoansServerSchema } from "../server/loans-server";

const loans = buildCodecAndFormSchema(LoansServerSchema(), {
	questionsLoans: {
		q3: atomicCodecs.yesNoBool,
		q4: atomicCodecs.yesNoBool,
	},
});

export const LoansFormSchema = loans.outputSchema;
export const loansServerToForm = loans.fromInput;
export const loansFormToServer = loans.fromOutput;
export type LoansForm = z.infer<typeof LoansFormSchema>;
