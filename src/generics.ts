import type { DefaultValues } from "react-hook-form";
import type { z } from "zod";
import {
	ArFormSchema,
	arFormToServer,
	arServerToForm,
} from "~/components/schemas/codecs/ar-codecs";
import {
	LoansFormSchema,
	loansFormToServer,
	loansServerToForm,
} from "~/components/schemas/codecs/loans-codecs";
import {
	ArSalesFormValidationSchema,
	ArScorerFormValidationSchema,
} from "~/components/schemas/generated-validation-schemas/ar-validations";
import {
	LoansSalesFormOutSchema,
	LoansScorerFormOutSchema,
} from "~/components/schemas/generated-validation-schemas/loans-validations";

export type ScoringKind = "AR" | "Loans";
export type Role = "Sales" | "Scorer";

const schemaFor = {
	AR: {
		Sales: ArSalesFormValidationSchema,
		Scorer: ArScorerFormValidationSchema,
	},
	Loans: { Sales: LoansSalesFormOutSchema, Scorer: LoansScorerFormOutSchema },
} satisfies Record<ScoringKind, Record<Role, z.ZodTypeAny>>;

type SchemaMap = typeof schemaFor;

const baseFormSchemas = {
	AR: ArFormSchema,
	Loans: LoansFormSchema,
} as const satisfies Record<ScoringKind, z.ZodTypeAny>;

export type FormInFor<SK extends ScoringKind> = z.infer<
	(typeof baseFormSchemas)[SK]
>;
export type FormOutFor<SK extends ScoringKind, R extends Role> = z.output<
	SchemaMap[SK][R]
>;

export function getSchema<SK extends ScoringKind, R extends Role>(
	sk: SK,
	role: R,
): z.ZodType<
	FormOutFor<SK, R>,
	z.ZodTypeDef & { typeName: string },
	FormInFor<SK>
> {
	return schemaFor[sk][role] as z.ZodType<
		FormOutFor<SK, R>,
		z.ZodTypeDef & { typeName: string },
		FormInFor<SK>
	>;
}

export const defaultValuesFor: {
	[SK in ScoringKind]: DefaultValues<FormInFor<SK>>;
} = {
	AR: {
		q1l0: undefined,
		q2l0: undefined,
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
