import {
	type FieldErrors,
	type FieldValues,
	type Path,
	useFormContext,
	useWatch,
} from "react-hook-form";
import type { QuestionnaireAnswerMap } from "../model/types";
import { QUESTIONNAIRE_ANSWERS_PATH } from "./form-types";

export function useQuestionnaireForm<
	FormValues extends FieldValues,
	QuestionId extends string,
>() {
	const {
		formState: { errors },
		register,
		setValue,
	} = useFormContext<FormValues>();

	// Subscribes to the full questionnaire answer map, so all rows update together.
	const questionnaireAnswers = useWatch<FormValues>({
		name: QUESTIONNAIRE_ANSWERS_PATH as Path<FormValues>,
	}) as QuestionnaireAnswerMap<QuestionId> | undefined;

	return {
		errors,
		questionnaireAnswers,
		register,
		setValue,
	};
}

export function getQuestionnaireAnswerError<
	FormValues extends FieldValues,
	QuestionId extends string,
>(errors: FieldErrors<FormValues>, questionId: QuestionId): string | undefined {
	const message = (
		errors as { questionnaire?: { answers?: Record<string, unknown> } }
	).questionnaire?.answers?.[questionId] as
		| { answer?: { message?: unknown } }
		| undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}
