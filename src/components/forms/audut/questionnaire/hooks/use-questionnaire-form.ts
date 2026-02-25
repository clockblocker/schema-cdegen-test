import {
	type FieldErrors,
	type FieldValues,
	type Path,
	useFormContext,
	useWatch,
} from "react-hook-form";
import type { QuestionnaireAnswerMap } from "../model/types";
import { QUESTIONARE_ANSWERS_PATH } from "./form-types";

export function useQuestionnaireForm<
	FormValues extends FieldValues,
	QuestionId extends string,
>() {
	const {
		formState: { errors },
		register,
		setValue,
	} = useFormContext<FormValues>();

	// TODO: Narrow this subscription (per-group or per-row) to reduce cross-row re-renders.
	const questionnaireAnswers = useWatch<FormValues>({
		name: QUESTIONARE_ANSWERS_PATH as Path<FormValues>,
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
		errors as { questionare?: { answers?: Record<string, unknown> } }
	).questionare?.answers?.[questionId] as
		| { answer?: { message?: unknown } }
		| undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}
