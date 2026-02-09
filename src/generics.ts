import type { DefaultValues } from "react-hook-form";
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

type SchemaFor = {
	[SK in ScoringKind]: {
		[R in Role]: z.ZodType<
			FormOutFor<SK, R>,
			z.ZodTypeDef & { typeName: string },
			FormInFor<SK>
		>;
	};
};

const schemaFor = {
	AR: {
		Sales: ArSalesFormValidationSchema,
		Scorer: ArScorerFormValidationSchema,
	},
	Loans: {
		Sales: LoansSalesFormOutSchema,
		Scorer: LoansScorerFormOutSchema,
	},
} satisfies SchemaFor;

export function getSchema<SK extends ScoringKind, R extends Role>(
	sk: SK,
	role: R,
) {
	return schemaFor[sk][role];
}

export const defaultValuesFor: {
	[SK in ScoringKind]: DefaultValues<FormInFor<SK>>;
} = {
	AR: {
		questions: {
			q1: undefined,
			q2: undefined,
		},
	},
	Loans: {
		questionsLoans: {
			q3: undefined,
			q4: undefined,
		},
	},
};

// decode: server → form (for loading server data into forms)
export const serverToFormCodec = {
	AR: arServerToForm,
	Loans: loansServerToForm,
};

// encode: form → server (for submitting form data to the server)
export const formToServerCodec = {
	AR: arFormToServer,
	Loans: loansFormToServer,
};
