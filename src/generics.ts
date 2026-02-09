import { z } from "zod";
import {
	type ArFormIn,
	type ArSalesFormOut,
	ArSalesFormOutSchema,
	type ArScorerFormOut,
	ArScorerFormOutSchema,
} from "~/components/generated-schemas/ar/ar-form";
import {
	type LoansFormIn,
	type LoansSalesFormOut,
	LoansSalesFormOutSchema,
	type LoansScorerFormOut,
	LoansScorerFormOutSchema,
} from "~/components/generated-schemas/loans/loans-form";

export type Role = "Sales" | "Scorer";
export type ScoringKind = "AR" | "Loans";

export type FormInFor<SK extends ScoringKind> = SK extends "AR"
	? ArFormIn
	: SK extends "Loans"
		? LoansFormIn
		: never;

export type FormOutFor<SK extends ScoringKind, R extends Role> = SK extends "AR"
	? R extends "Sales"
		? ArSalesFormOut
		: ArScorerFormOut
	: SK extends "Loans"
		? R extends "Sales"
			? LoansSalesFormOut
			: LoansScorerFormOut
		: never;

export const schemaFor: Record<ScoringKind, Record<Role, z.ZodTypeAny>> = {
	AR: {
		Sales: ArSalesFormOutSchema,
		Scorer: ArScorerFormOutSchema,
	},
	Loans: {
		Sales: LoansSalesFormOutSchema,
		Scorer: LoansScorerFormOutSchema,
	},
};

export const defaultValuesFor: Record<ScoringKind, Record<string, unknown>> = {
	AR: {
		questions: {
			q1: undefined,
			q2: undefined,
		},
	} satisfies ArFormIn,
	Loans: {
		questionsLoans: {
			q3: undefined,
			q4: undefined,
		},
	} satisfies LoansFormIn,
};
