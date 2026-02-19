import { codec } from "~/codec-builder-library/adapter-builder/codec-pair";
import type { hospitalFieldAdaptersCodec } from "./field-adapters";

type WithAdaptedToFormFields = ReturnType<
	typeof hospitalFieldAdaptersCodec.fromInput
>;

function reshapeFromInput(input: WithAdaptedToFormFields) {
	const { l1 } = input;
	return {
		l0: {
			q1: input.q1l0,
			q2: input.q2l0,
			q3: input.q3l0,
			q4: input.q4l0,
			q5: input.q5l0,
		},
		l1,
	};
}

function reshapeToInput(output: ReturnType<typeof reshapeFromInput>) {
	return {
		q1l0: output.l0.q1,
		q2l0: output.l0.q2,
		q3l0: output.l0.q3,
		q4l0: output.l0.q4,
		q5l0: output.l0.q5,
		l1: output.l1,
	};
}

export const hospitalReshapeCodec =
	codec<WithAdaptedToFormFields>()(reshapeFromInput)(reshapeToInput);
