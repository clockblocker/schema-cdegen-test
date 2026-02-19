import type { z } from "zod";
import type { ScoringFlavor } from "../business-types";
import type { batteriesFor } from "./batteries";
import type { Assert, IsMutualByFlavor } from "./helper-shapes";

export type Scoring<F extends ScoringFlavor> = z.infer<
	(typeof batteriesFor)[F]["formSchema"]
>;

export type ScoringServerInput<F extends ScoringFlavor> = z.infer<
	(typeof batteriesFor)[F]["serverSchema"]
>;

export type ScoringFromSchema = {
	[F in ScoringFlavor]: z.infer<(typeof batteriesFor)[F]["formSchema"]>;
};

type ScoringByFlavor = {
	[F in ScoringFlavor]: Scoring<F>;
};

type _scoringMatchesSchema = Assert<
	IsMutualByFlavor<ScoringFlavor, ScoringFromSchema, ScoringByFlavor>
>;
