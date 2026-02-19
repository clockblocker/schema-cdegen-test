import { codec, pipeCodecs } from "../../../../components/wadk-typings/common-codecs/codec-pair";
import { loansFieldAdaptersCodec } from "./codec-for-field-adapters";

type FieldAdaptersOutput = ReturnType<typeof loansFieldAdaptersCodec.fromInput>;

const loansShapeChangeCodec = codec<FieldAdaptersOutput>()((input) => ({
	questions: input.questionsLoans,
}))((output) => ({
	questionsLoans: output.questions,
}));

export const LoansServerToFormCodec = pipeCodecs(
	loansFieldAdaptersCodec,
	loansShapeChangeCodec,
);
