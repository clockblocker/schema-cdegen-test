import type { z } from "zod";

export type CodecPair<I, O> = {
	fromInput: (input: I) => O;
	fromOutput: (output: O) => I;
};

export function codec<I>() {
	return <O>(fromInput: (input: I) => O) =>
		(fromOutput: (output: O) => I): CodecPair<I, O> => ({
			fromInput,
			fromOutput,
		});
}

export function pipeCodecs<A, B, C>(
	ab: CodecPair<A, B>,
	bc: CodecPair<B, C>,
): CodecPair<A, C> {
	return {
		fromInput: (input: A) => bc.fromInput(ab.fromInput(input)),
		fromOutput: (output: C) => ab.fromOutput(bc.fromOutput(output)),
	};
}

export function withOutputSchema<
	I,
	O,
	TSchema extends z.ZodType<O, z.ZodTypeDef, any>,
>(codecPair: CodecPair<I, O>, outputSchema: TSchema) {
	return {
		...codecPair,
		outputSchema,
	};
}
