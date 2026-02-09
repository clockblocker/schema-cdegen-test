import {
	type ArFormIn,
	type ArSalesFormOut,
	ArSalesFormOutSchema,
	type ArScorerFormOut,
	ArScorerFormOutSchema,
} from "~/components/generated-schemas/ar/ar-form";

export type Role = "Sales" | "Scorer";
export type ScoringKind = "AR" | "Loans";

export type FormOutFor<R extends Role> = R extends "Sales"
	? ArSalesFormOut
	: ArScorerFormOut;

export const schemaFor = {
	Sales: ArSalesFormOutSchema,
	Scorer: ArScorerFormOutSchema,
} as const;

export const defaultValues: ArFormIn = {
	questions: {
		q1: undefined,
		q2: undefined,
	},
};
