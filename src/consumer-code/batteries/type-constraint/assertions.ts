// --- Assertions

import type { z } from "zod";
import type {
	AuditableBuildingKind,
	UserRole,
} from "~/consumer-code/business-types";
import type { batteriesFor } from "../batteries";
import type {
	Audut,
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries-types";

type IsMutuallyAssignable<TA, TB> = [TA] extends [TB]
	? [TB] extends [TA]
		? true
		: false
	: false;

type Assert<T extends true> = T;

type IsMutualByKind<
	TKind extends string,
	TLeft extends Record<TKind, unknown>,
	TRight extends Record<TKind, unknown>,
> = {
	[K in TKind]: IsMutuallyAssignable<TLeft[K], TRight[K]>;
}[TKind] extends true
	? true
	: false;

export type IsAssignableByKind<
	TKind extends string,
	TFrom extends Record<TKind, unknown>,
	TTo extends Record<TKind, unknown>,
> = {
	[K in TKind]: [TFrom[K]] extends [TTo[K]] ? true : false;
}[TKind] extends true
	? true
	: false;

type AudutByBuildingKind = {
	[F in AuditableBuildingKind]: Audut<F>;
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

type AudutFromSchema = {
	[F in AuditableBuildingKind]: z.infer<(typeof batteriesFor)[F]["formSchema"]>;
};

type _audutMatchesSchema = Assert<
	IsMutualByKind<AuditableBuildingKind, AudutFromSchema, AudutByBuildingKind>
>;

type _audutRoleValidatedMatchesDraft = Assert<
	IsMutualByKind<
		AuditableBuildingKind,
		AudutRoleValidatedByBuildingKindAndRole,
		AudutRoleDraftByBuildingKindAndRole
	>
>;
