import { codec } from "~/codec-builder-library/adapter-builder/codec-pair";
import type { arFieldAdaptersCodec } from "./field-adapters";

type FieldAdaptersOutput = ReturnType<typeof arFieldAdaptersCodec.fromInput>;

function l0FromInput(input: FieldAdaptersOutput) {
	return {
		q1: input.q1l0,
		q2: input.q2l0,
		q3: input.q3l0,
		q4: input.q4l0,
		q5: input.q5l0,
	};
}

function l0ToInput(output: ReturnType<typeof l0FromInput>) {
	return {
		q1l0: output.q1,
		q2l0: output.q2,
		q3l0: output.q3,
		q4l0: output.q4,
		q5l0: output.q5,
	};
}

export const arReshapeCodec = codec<FieldAdaptersOutput>()((input) => {
	const { l1 } = input;
	return {
		l0: l0FromInput(input),
		l1,
	};
})((output) => ({
	...l0ToInput(output.l0),
	l1: output.l1,
}));
