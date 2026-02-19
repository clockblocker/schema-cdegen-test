import type { z } from "zod";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import type { batteriesFor } from "./batteries";

export type AudutFormDraft<F extends AuditableBuildingKind> = z.input<
	AudutFormSchema<F>
>;

export type AudutFormValidatedFor<
	R extends UserRole,
	F extends AuditableBuildingKind,
> = z.output<AudutFormValidatedSchemaFor<F, R>>;

export type Audut<F extends AuditableBuildingKind> = AudutFormDraft<F>;

export type AudutServerInput<F extends AuditableBuildingKind> = z.infer<
	(typeof batteriesFor)[F]["serverSchema"]
>;

// -- Helpers

type AudutFormSchema<F extends AuditableBuildingKind> =
	(typeof batteriesFor)[F]["formSchema"];

type AudutFormValidatedSchemaFor<
	F extends AuditableBuildingKind,
	R extends UserRole,
> = (typeof batteriesFor)[F]["formValidatedSchemaForRole"][R];
