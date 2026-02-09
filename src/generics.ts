import type { z } from "zod";
import {
	type ArForm,
	arFormToServer,
	arServerToForm,
} from "~/components/schemas/codecs/ar-codecs";
import {
	type LoansForm,
	loansFormToServer,
	loansServerToForm,
} from "~/components/schemas/codecs/loans-codecs";
import {
	type ArSalesFormValidated,
	ArSalesFormValidationSchema,
	type ArScorerFormValidated,
	ArScorerFormValidationSchema,
} from "~/components/schemas/generated-validation-schemas/ar-validations";
import {
	type LoansSalesFormOut,
	LoansSalesFormOutSchema,
	type LoansScorerFormOut,
	LoansScorerFormOutSchema,
} from "~/components/schemas/generated-validation-schemas/loans-validations";

export type Role = "Sales" | "Scorer";
export type ScoringKind = "AR" | "Loans";

export type FormInFor<SK extends ScoringKind> = SK extends "AR"
	? ArForm
	: SK extends "Loans"
		? LoansForm
		: never;

export type FormOutFor<SK extends ScoringKind, R extends Role> = SK extends "AR"
	? R extends "Sales"
		? ArSalesFormValidated
		: ArScorerFormValidated
	: SK extends "Loans"
		? R extends "Sales"
			? LoansSalesFormOut
			: LoansScorerFormOut
		: never;

export const schemaFor: Record<ScoringKind, Record<Role, z.ZodTypeAny>> = {
	AR: {
		Sales: ArSalesFormValidationSchema,
		Scorer: ArScorerFormValidationSchema,
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
	} satisfies ArForm,
	Loans: {
		questionsLoans: {
			q3: undefined,
			q4: undefined,
		},
	} satisfies LoansForm,
};

// decode: server → form (for loading server data into forms)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const serverToFormCodec: Record<ScoringKind, (data: any) => any> = {
	AR: arServerToForm,
	Loans: loansServerToForm,
};

// encode: form → server (for submitting form data to the server)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formToServerCodec: Record<ScoringKind, (data: any) => any> = {
	AR: arFormToServer,
	Loans: loansFormToServer,
};
