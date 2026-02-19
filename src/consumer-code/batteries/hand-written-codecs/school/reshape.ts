import { codec } from "~/lib/codec-builder-library/adapter-builder/codec-pair";
import type { schoolFieldAdaptersCodec } from "./adapt-fields";

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
