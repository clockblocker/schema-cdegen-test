import {
	type FormIn,
	type SalesFormOut,
	SalesFormOutSchema,
	type ScorerFormOut,
	ScorerFormOutSchema,
} from "~/schemas";

export type Role = "Sales" | "Scorer";
export type ScoringKind = "AR" | "Loans";

export type FormOutFor<R extends Role> = R extends "Sales"
	? SalesFormOut
	: ScorerFormOut;

export const schemaFor = {
	Sales: SalesFormOutSchema,
	Scorer: ScorerFormOutSchema,
} as const;

export const defaultValues: FormIn = {
	questions: {
		q1: undefined,
		q2: undefined,
	},
};
