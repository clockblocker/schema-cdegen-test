import {
	codec,
	pipeCodecs,
} from "~/codec-builder-library/adapter-builder/codec-pair";
import { loansFieldAdaptersCodec } from "./field-adapters";

type FieldAdaptersOutput = ReturnType<typeof loansFieldAdaptersCodec.fromInput>;

const loansShapeChangeCodec = codec<FieldAdaptersOutput>()((input) => ({
	questions: {
		q3: input.questionsLoans.q3,
		q4: input.questionsLoans.q4,
	},
}))((output) => ({
	questionsLoans: {
		q3: output.questions.q3,
		q4: output.questions.q4,
	},
}));

export const LoansServerToFormCodec = pipeCodecs(
	loansFieldAdaptersCodec,
	loansShapeChangeCodec,
);
