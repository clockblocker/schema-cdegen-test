import type { Resolver } from "react-hook-form";
import type { z } from "zod";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import type { batteriesFor } from "./batteries";
import type { Assert, IsMutualByKind } from "./helper-shapes";

export type AudutFormResolverFor<
	F extends AuditableBuildingKind,
	R extends UserRole,
> = (typeof batteriesFor)[F]["formResolverForRole"][R];

type ResolverOutput<TResolver> =
	TResolver extends Resolver<any, any, infer TOutput> ? TOutput : never;

export type AudutFormDraft<F extends AuditableBuildingKind> = ReturnType<
	(typeof batteriesFor)[F]["codec"]["fromInput"]
>;

export type AudutFormValidatedFor<
	R extends UserRole,
	F extends AuditableBuildingKind,
> = ResolverOutput<AudutFormResolverFor<F, R>>;

export type AudutFormValidated<F extends AuditableBuildingKind> =
	AudutFormDraft<F>;

export type Audut<F extends AuditableBuildingKind> = AudutFormDraft<F>;

export type AudutServerInput<F extends AuditableBuildingKind> = z.infer<
	(typeof batteriesFor)[F]["serverSchema"]
>;

export type AudutFromSchema = {
	[F in AuditableBuildingKind]: AudutFormDraft<F>;
};

type AudutByBuildingKind = {
	[F in AuditableBuildingKind]: Audut<F>;
};

type AudutDraftByBuildingKind = {
	[F in AuditableBuildingKind]: AudutFormDraft<F>;
};

type _audutMatchesSchema = Assert<
	IsMutualByKind<
		AuditableBuildingKind,
		AudutDraftByBuildingKind,
		AudutByBuildingKind
	>
>;
