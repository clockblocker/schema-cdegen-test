import { z } from "zod";

// Server schemas — booleans
const boolOrUndefined = z.boolean().optional();

type Properties<T> = {
	[K in keyof T]-?: z.ZodType<T[K], z.ZodTypeDef, T[K]>;
};

export interface SchoolServer {
	questionsSchool: {
		q3: boolean | undefined;
		q4: boolean | undefined;
	};
}

export function SchoolServerSchema(): z.ZodObject<Properties<SchoolServer>> {
	return z.object({
		questionsSchool: z.object({
			q3: boolOrUndefined,
			q4: boolOrUndefined,
		}),
	}) as z.ZodObject<Properties<SchoolServer>>;
}
