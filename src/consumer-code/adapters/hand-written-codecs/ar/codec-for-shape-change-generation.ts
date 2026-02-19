import { codec, pipeCodecs } from "../../../../components/wadk-typings/common-codecs/codec-pair";
import { arFieldAdaptersCodec } from "./codec-for-field-adapters";

type FieldAdaptersOutput = ReturnType<typeof arFieldAdaptersCodec.fromInput>;

const arShapeChangeCodec = codec<FieldAdaptersOutput>()((input) => ({
	l0: {
		q1: input.q1l0,
		q2: input.q2l0,
		q3: input.q3l0,
		q4: input.q4l0,
		q5: input.q5l0,
	},
	l1: input.l1,
}))((output) => ({
	q1l0: output.l0.q1,
	q2l0: output.l0.q2,
	q3l0: output.l0.q3,
	q4l0: output.l0.q4,
	q5l0: output.l0.q5,
	l1: output.l1,
}));

export const ArServerToFormCodec = pipeCodecs(
	arFieldAdaptersCodec,
	arShapeChangeCodec,
);
