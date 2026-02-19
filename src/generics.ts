import type { DefaultValues } from "react-hook-form";
import type { z } from "zod";
import {
	HospitalFormSchema,
	hospitalFormToServer,
	hospitalServerToForm,
} from "~/components/schemas/codecs/hospital-codecs";
import {
	SchoolFormSchema,
	schoolFormToServer,
	schoolServerToForm,
} from "~/components/schemas/codecs/school-codecs";
import {
	HospitalSalesFormValidationSchema,
	HospitalScorerFormValidationSchema,
} from "~/components/schemas/generated-validation-schemas/hospital-validations";
import {
	SchoolSalesFormOutSchema,
	SchoolScorerFormOutSchema,
} from "~/components/schemas/generated-validation-schemas/school-validations";

export type AudutKind = "Hospital" | "School";
export type Role = "Sales" | "Scorer";

const schemaFor = {
	Hospital: {
		Sales: HospitalSalesFormValidationSchema,
		Scorer: HospitalScorerFormValidationSchema,
	},
	School: {
		Sales: SchoolSalesFormOutSchema,
		Scorer: SchoolScorerFormOutSchema,
	},
} satisfies Record<AudutKind, Record<Role, z.ZodTypeAny>>;

type SchemaMap = typeof schemaFor;

const baseFormSchemas = {
	Hospital: HospitalFormSchema,
	School: SchoolFormSchema,
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
		questionsSchool: {
			q3: undefined,
			q4: undefined,
		},
	},
};

// decode: server → form (for loading server data into forms)
export const serverToFormCodec = {
	Hospital: hospitalServerToForm,
	School: schoolServerToForm,
};

// encode: form → server (for submitting form data to the server)
export const formToServerCodec = {
	Hospital: hospitalFormToServer,
	School: schoolFormToServer,
};
