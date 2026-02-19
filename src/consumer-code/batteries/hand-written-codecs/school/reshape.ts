import { codec } from "~/codec-builder-library/adapter-builder/codec-pair";
import type { schoolFieldAdaptersCodec } from "./field-adapters";

type WithAdaptedToFormFields = ReturnType<
	typeof schoolFieldAdaptersCodec.fromInput
>;

function reshapeFromInput(input: WithAdaptedToFormFields) {
	const { questionsSchool, ...rest } = input;
	return {
		...rest,
		questions: questionsSchool,
	};
}

function reshapeToInput(output: ReturnType<typeof reshapeFromInput>) {
	const { questions, ...rest } = output;
	return {
		...rest,
		questionsSchool: questions,
	};
}

export const schoolReshapeCodec =
	codec<WithAdaptedToFormFields>()(reshapeFromInput)(reshapeToInput);
