import { atomicCodecs } from "../../../../components/wadk-typings/common-codecs";
import { buildAddaptersAndOutputSchema } from "../../../../components/wadk-typings/common-codecs/build-codec";
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
