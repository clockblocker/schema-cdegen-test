import type { ScoringFlavor } from "../business-types";
import { ArFormSchema } from "./generated/ar/reshape-schema";
import { ArServerSchema } from "./generated/ar/server-schema";
import { LoansFormSchema } from "./generated/loans/reshape-schema";
import { LoansServerSchema } from "./generated/loans/server-schema";
import { ArServerToFormCodec } from "./hand-written-codecs/ar";
import { LoansServerToFormCodec } from "./hand-written-codecs/loans";
import type { BatteriesRecord } from "./helper-shapes";

export const batteriesFor = {
	AR: {
		flavor: "AR",
		codec: ArServerToFormCodec,
		serverSchema: ArServerSchema,
		formSchema: ArFormSchema,
	},
	Loans: {
		flavor: "Loans",
		codec: LoansServerToFormCodec,
		serverSchema: LoansServerSchema,
		formSchema: LoansFormSchema,
	},
} as const satisfies BatteriesRecord<ScoringFlavor>;
