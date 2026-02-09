import { z } from "zod";
import {
	type ArFormIn,
	type ArSalesFormOut,
	ArSalesFormOutSchema,
	type ArScorerFormOut,
	ArScorerFormOutSchema,
} from "~/components/generated-schemas/ar/ar-form";

export type Role = "Sales" | "Scorer";
export type ScoringKind = "AR" | "Loans";

export type FormInFor<SK extends ScoringKind> = SK extends "AR"
	? ArFormIn
	: never;

export type FormOutFor<SK extends ScoringKind, R extends Role> = SK extends "AR"
	? R extends "Sales"
		? ArSalesFormOut
		: ArScorerFormOut
	: never;

export const schemaFor: Partial<Record<ScoringKind, Record<Role, z.ZodTypeAny>>> = {
	AR: {
		Sales: ArSalesFormOutSchema,
		Scorer: ArScorerFormOutSchema,
	},
};

export const defaultValuesFor: Partial<Record<ScoringKind, Record<string, unknown>>> = {
	AR: {
		questions: {
			q1: undefined,
			q2: undefined,
		},
	} satisfies ArFormIn,
};
