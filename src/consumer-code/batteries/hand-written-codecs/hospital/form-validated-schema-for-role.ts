import type { UserRole } from "~/consumer-code/business-types";
import { z } from "zod";
import { HospitalFormValidatedSchema } from "./form-validated-schema";

const hospitalElectricianValidatedSchema = HospitalFormValidatedSchema.extend({
	l0: HospitalFormValidatedSchema.shape.l0.required({
		q4: true,
	}),
	l1: HospitalFormValidatedSchema.shape.l1.required({
		q4l1: true,
	}),
});

const hospitalPlumberValidatedSchema = HospitalFormValidatedSchema.extend({
	l0: HospitalFormValidatedSchema.shape.l0.required({
		q3: true,
	}),
	l1: HospitalFormValidatedSchema.shape.l1.required({
		q1l1: true,
	}),
});

export const HospitalFormValidatedSchemaForRole = {
	Electrician: hospitalElectricianValidatedSchema,
	Plumber: hospitalPlumberValidatedSchema,
} as const satisfies Record<UserRole, z.ZodTypeAny>;
