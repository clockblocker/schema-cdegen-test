import type { z } from "zod";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import type { batteriesFor } from "./batteries";
import type {
	Assert,
	IsAssignableByKind,
	IsMutualByKind,
} from "./helper-shapes";

export type AudutFormSchema<F extends AuditableBuildingKind> =
	(typeof batteriesFor)[F]["formSchema"];

export type AudutFormValidatedSchemaFor<
	F extends AuditableBuildingKind,
	R extends UserRole,
> = (typeof batteriesFor)[F]["formValidatedSchemaForRole"][R];

export type AudutFormDraft<F extends AuditableBuildingKind> = z.input<
	AudutFormSchema<F>
>;

export type AudutFormValidatedFor<
	R extends UserRole,
	F extends AuditableBuildingKind,
> = z.output<AudutFormValidatedSchemaFor<F, R>>;

export type AudutFormValidated<F extends AuditableBuildingKind> =
	AudutFormValidatedFor<UserRole, F>;

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

type AudutRoleValidatedByBuildingKindAndRole = {
	[F in AuditableBuildingKind]: {
		[R in UserRole]: AudutFormValidatedFor<R, F>;
	};
};

type AudutRoleDraftByBuildingKindAndRole = {
	[F in AuditableBuildingKind]: {
		[R in UserRole]: AudutFormDraft<F>;
	};
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

type _audutRoleValidatedMatchesDraft = Assert<
	IsMutualByKind<
		AuditableBuildingKind,
		AudutRoleValidatedByBuildingKindAndRole,
		AudutRoleDraftByBuildingKindAndRole
	>
>;
