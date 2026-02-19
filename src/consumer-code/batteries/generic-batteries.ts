import type { z } from "zod";
import { ArFormSchema } from "./generated/ar/reshape-schema";
import { ArServerSchema } from "./generated/ar/server-schema";
import { LoansFormSchema } from "./generated/loans/reshape-schema";
import { LoansServerSchema } from "./generated/loans/server-schema";
import { ArServerToFormCodec } from "./hand-written-codecs/ar";
import { LoansServerToFormCodec } from "./hand-written-codecs/loans";
import type {
	Assert,
	BatteriesRecord,
	IsMutualByFlavor,
} from "./helper-shapes";

export type Flavor = "AR" | "Loans";

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
} as const satisfies BatteriesRecord<Flavor>;

export type Scoring<F extends Flavor> = z.infer<
	(typeof batteriesFor)[F]["formSchema"]
>;

export type ScoringServerInput<F extends Flavor> = z.infer<
	(typeof batteriesFor)[F]["serverSchema"]
>;

export type ScoringFromSchema = {
	[F in Flavor]: z.infer<(typeof batteriesFor)[F]["formSchema"]>;
};

type ScoringByFlavor = {
	[F in Flavor]: Scoring<F>;
};

type _scoringMatchesSchema = Assert<
	IsMutualByFlavor<Flavor, ScoringFromSchema, ScoringByFlavor>
>;
