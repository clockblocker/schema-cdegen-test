import { type FieldErrors, useFormContext, useWatch } from "react-hook-form";
import type { QuestionnaireAnswerMap } from "../model/types";
import {
	QUESTIONARE_ANSWERS_PATH,
	type QuestionnaireAudit,
} from "./form-types";

export function getAnswerErrorMessage(
	errors: FieldErrors<QuestionnaireAudit>,
	questionId: string,
): string | undefined {
	const message = (errors.questionare as { answers?: Record<string, unknown> })
		?.answers?.[questionId] as { answer?: { message?: unknown } } | undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}

export function useQuestionnaireForm() {
	const {
		control,
		formState: { errors },
		register,
		setValue,
	} = useFormContext<QuestionnaireAudit>();

	// TODO: Narrow this subscription (per-group or per-row) to reduce cross-row re-renders.
	const questionnaireAnswers = useWatch<
		QuestionnaireAudit,
		typeof QUESTIONARE_ANSWERS_PATH
	>({
		name: QUESTIONARE_ANSWERS_PATH,
	}) as Partial<QuestionnaireAnswerMap> | undefined;

	return {
		control,
		errors,
		questionnaireAnswers,
		register,
		setValue,
	};
}
