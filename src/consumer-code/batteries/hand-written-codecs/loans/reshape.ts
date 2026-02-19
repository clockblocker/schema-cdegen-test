import { codec } from "~/codec-builder-library/adapter-builder/codec-pair";
import type { loansFieldAdaptersCodec } from "./field-adapters";

type FieldAdaptersOutput = ReturnType<typeof loansFieldAdaptersCodec.fromInput>;

function questionsFromInput(input: FieldAdaptersOutput) {
	return input.questionsLoans;
}

function questionsToInput(output: ReturnType<typeof questionsFromInput>) {
	return output;
}

export const loansReshapeCodec = codec<FieldAdaptersOutput>()((input) => {
	const { questionsLoans, ...rest } = input;
	return {
		...rest,
		questions: questionsFromInput(input),
	};
})((output) => {
	const { questions, ...rest } = output;
	return {
		...rest,
		questionsLoans: questionsToInput(questions),
	};
});
