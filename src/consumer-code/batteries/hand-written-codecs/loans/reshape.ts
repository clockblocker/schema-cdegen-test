import { codec } from "~/codec-builder-library/adapter-builder/codec-pair";
import type { loansFieldAdaptersCodec } from "./field-adapters";

type WithAdaptedToFormFields = ReturnType<
	typeof loansFieldAdaptersCodec.fromInput
>;

function reshapeFromInput(input: WithAdaptedToFormFields) {
	const { questionsLoans, ...rest } = input;
	return {
		...rest,
		questions: questionsLoans,
	};
}

function reshapeToInput(output: ReturnType<typeof reshapeFromInput>) {
	const { questions, ...rest } = output;
	return {
		...rest,
		questionsLoans: questions,
	};
}

export const loansReshapeCodec =
	codec<WithAdaptedToFormFields>()(reshapeFromInput)(reshapeToInput);
