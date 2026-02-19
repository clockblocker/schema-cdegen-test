import type z from "zod/v3";
import { SchoolFormSchema } from "../codecs/school-codecs";

export const SchoolSalesFormOutSchema = SchoolFormSchema.extend({
	questionsSchool: SchoolFormSchema.shape.questionsSchool.required({
		q3: true,
	}),
});

export const SchoolScorerFormOutSchema = SchoolSalesFormOutSchema.extend({
	questionsSchool: SchoolSalesFormOutSchema.shape.questionsSchool.required({
		q4: true,
	}),
});

export type SchoolSalesFormOut = z.infer<typeof SchoolSalesFormOutSchema>;
export type SchoolScorerFormOut = z.infer<typeof SchoolScorerFormOutSchema>;
