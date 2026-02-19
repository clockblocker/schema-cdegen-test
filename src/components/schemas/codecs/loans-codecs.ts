import type { z } from "zod";
import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { LoansServerSchema } from "../server/loans-server";

const loans = buildAddaptersAndOutputSchema(LoansServerSchema(), {
	questionsLoans: {
		q3: atomicCodecs.yesNoBool,
		q4: atomicCodecs.yesNoBool,
	},
});

export const LoansFormSchema = loans.outputSchema;
export const loansServerToForm = loans.fromInput;
export const loansFormToServer = loans.fromOutput;
export type LoansForm = z.infer<typeof LoansFormSchema>;
