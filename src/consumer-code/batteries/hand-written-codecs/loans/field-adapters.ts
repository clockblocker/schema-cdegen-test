import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { LoansServerSchema } from "../../generated/loans/server-schema";

export const loansFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	LoansServerSchema,
	{
		questionsLoans: {
			q3: atomicCodecs.yesNoBool,
			q4: atomicCodecs.yesNoBool,
		},
	},
);
