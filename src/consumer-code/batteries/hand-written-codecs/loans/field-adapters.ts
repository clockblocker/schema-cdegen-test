import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { LoansServerSchema } from "../../generated/loans/server-schema";

const { yesNoBool } = atomicCodecs;

const loansFieldCodec = {
	questionsLoans: {
		q3: yesNoBool,
		q4: yesNoBool,
	},
};

export const loansFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	LoansServerSchema,
	loansFieldCodec,
);
