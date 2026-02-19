// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

const boolOrUndefined = z.boolean().optional();

export const HospitalServerSchema = z.object({
	q1l0: boolOrUndefined,
	q2l0: boolOrUndefined,
	q3l0: z.number().optional(),
	q4l0: z.string().optional(),
	q5l0: z.string().nullish(),
	l1: z.object({
		q1l1: boolOrUndefined,
		q2l1: boolOrUndefined,
		q3l1: z.number().optional(),
		q4l1: z.string().optional(),
		q5l1: z.string().nullish(),
		l2: z.object({
			q1l2: boolOrUndefined,
			q2l2: boolOrUndefined,
			q3l2: z.number().optional(),
			q4l2: z.string().optional(),
			q5l2: z.string().nullish(),
		}),
		l2_arr: z
			.object({
				q1l2: boolOrUndefined,
				q2l2: boolOrUndefined,
				q3l2: z.number().optional(),
				q4l2: z.string().optional(),
				q5l2: z.string().nullish(),
				l3_arr: z
					.object({
						q1l2: boolOrUndefined,
						q2l2: boolOrUndefined,
						q3l2: z.number().optional(),
						q4l2: z.string().optional(),
						q5l2: z.string().nullish(),
					})
					.array(),
			})
			.array(),
	}),
});

export type HospitalServer = z.infer<typeof HospitalServerSchema>;
