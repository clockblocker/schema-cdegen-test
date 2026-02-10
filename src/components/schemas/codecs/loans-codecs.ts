import type { z } from "zod";
import { atomicCodecs } from "~/components/wadk-typings/common-codecs";
import { buildCodec } from "../../wadk-typings/common-codecs/build-codec";
import { LoansServerSchema } from "../server/loans-server";

const loans = buildCodec(LoansServerSchema, {
	questionsLoans: {
		q3: atomicCodecs.yesNoBool,
		q4: atomicCodecs.yesNoBool,
	},
});

export const LoansFormSchema = loans.formSchema;
export const loansServerToForm = loans.toForm;
export const loansFormToServer = loans.toServer;
export const LoansFormCodec = loans.codec;
export type LoansForm = z.infer<typeof LoansFormSchema>;
