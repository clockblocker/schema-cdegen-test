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

export type AudutKind = "Hospital" | "School";
export type Role = "Sales" | "Scorer";

const schemaFor = {
	Hospital: {
		Sales: ArSalesFormValidationSchema,
		Scorer: ArScorerFormValidationSchema,
	},
	School: {
		Sales: LoansSalesFormOutSchema,
		Scorer: LoansScorerFormOutSchema,
	},
} satisfies Record<AudutKind, Record<Role, z.ZodTypeAny>>;

type SchemaMap = typeof schemaFor;

const baseFormSchemas = {
	Hospital: ArFormSchema,
	School: LoansFormSchema,
} as const satisfies Record<AudutKind, z.ZodTypeAny>;

export type FormInFor<SK extends AudutKind> = z.infer<
	(typeof baseFormSchemas)[SK]
>;
export type FormOutFor<SK extends AudutKind, R extends Role> = z.output<
	SchemaMap[SK][R]
>;

export function getSchema<SK extends AudutKind, R extends Role>(
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
	[SK in AudutKind]: DefaultValues<FormInFor<SK>>;
} = {
	Hospital: {
		q1l0: undefined,
		q2l0: undefined,
	},
	School: {
		questionsLoans: {
			q3: undefined,
			q4: undefined,
		},
	},
};

// decode: server → form (for loading server data into forms)
export const serverToFormCodec = {
	Hospital: arServerToForm,
	School: loansServerToForm,
};

// encode: form → server (for submitting form data to the server)
export const formToServerCodec = {
	Hospital: arFormToServer,
	School: loansFormToServer,
};
