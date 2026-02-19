import { SchoolFormSchema } from "../../generated/school/reshape-schema";

const schoolQuestionsValidatedSchema = SchoolFormSchema.shape.questions.required({
	q3: true,
	q4: true,
});

export const SchoolFormValidatedSchema = SchoolFormSchema.extend({
	questions: schoolQuestionsValidatedSchema,
});
