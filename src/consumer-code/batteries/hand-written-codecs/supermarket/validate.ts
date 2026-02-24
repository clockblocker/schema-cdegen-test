import type { z } from "zod";
import type { UserRole } from "~/consumer-code/business-types";
import { SupermarketFormSchema } from "./reshape-wo-codegen";

const supermarketFormValidatedSchema = SupermarketFormSchema;

export const SupermarketFormValidatedSchemaForRole = {
	Electrician: supermarketFormValidatedSchema,
	Plumber: supermarketFormValidatedSchema,
} as const satisfies Record<
	UserRole,
	z.ZodType<
		z.output<typeof SupermarketFormSchema>,
		z.ZodTypeDef,
		z.input<typeof SupermarketFormSchema>
	>
>;
