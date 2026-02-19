import type { z } from "zod";
import type { AuditableBuildingKind } from "../business-types";
import type { batteriesFor } from "./batteries";
import type { Assert, IsMutualByKind } from "./helper-shapes";

export type Audut<F extends AuditableBuildingKind> = z.infer<
	(typeof batteriesFor)[F]["formSchema"]
>;

export type AudutServerInput<F extends AuditableBuildingKind> = z.infer<
	(typeof batteriesFor)[F]["serverSchema"]
>;

export type AudutFromSchema = {
	[F in AuditableBuildingKind]: z.infer<(typeof batteriesFor)[F]["formSchema"]>;
};

type AudutByBuildingKind = {
	[F in AuditableBuildingKind]: Audut<F>;
};

type _audutMatchesSchema = Assert<
	IsMutualByKind<AuditableBuildingKind, AudutFromSchema, AudutByBuildingKind>
>;
