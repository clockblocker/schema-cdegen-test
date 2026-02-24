import type { FieldErrors } from "react-hook-form";
import type { SupermarketAudit } from "./types";

export function getAnswerErrorMessage(
	errors: FieldErrors<SupermarketAudit>,
	questionId: string,
): string | undefined {
	const message = (errors.questionare as { answers?: Record<string, unknown> })
		?.answers?.[questionId] as { answer?: { message?: unknown } } | undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}
