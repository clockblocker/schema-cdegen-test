import type { z } from "zod";
import type { AuditableBuildingKind } from "../business-types";
import type { batteriesFor } from "./batteries";
import type { Assert, IsAssignableByKind, IsMutualByKind } from "./helper-shapes";

export type AudutFormSchema<F extends AuditableBuildingKind> =
	(typeof batteriesFor)[F]["formSchema"];

export type AudutFormValidatedSchema<F extends AuditableBuildingKind> =
	(typeof batteriesFor)[F]["formValidatedSchema"];

export type AudutFormDraft<F extends AuditableBuildingKind> = z.input<
	AudutFormSchema<F>
>;

export type AudutFormValidated<F extends AuditableBuildingKind> = z.output<
	AudutFormValidatedSchema<F>
>;

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

type AudutDraftByBuildingKind = {
	[F in AuditableBuildingKind]: AudutFormDraft<F>;
};

type AudutValidatedByBuildingKind = {
	[F in AuditableBuildingKind]: AudutFormValidated<F>;
};

type _audutMatchesSchema = Assert<
	IsMutualByKind<AuditableBuildingKind, AudutFromSchema, AudutByBuildingKind>
>;

type _audutValidatedAssignableToDraft = Assert<
	IsAssignableByKind<
		AuditableBuildingKind,
		AudutValidatedByBuildingKind,
		AudutDraftByBuildingKind
	>
>;
