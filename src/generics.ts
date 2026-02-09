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

export const schemaFor = {
	AR: {
		Sales: ArSalesFormOutSchema,
		Scorer: ArScorerFormOutSchema,
	},
} as const;

export const defaultValuesFor = {
	AR: {
		questions: {
			q1: undefined,
			q2: undefined,
		},
	} satisfies ArFormIn,
} as const;
