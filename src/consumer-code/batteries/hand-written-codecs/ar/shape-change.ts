import {
	codec,
	pipeCodecs,
} from "~/codec-builder-library/adapter-builder/codec-pair";
import { arFieldAdaptersCodec } from "./field-adapters";

type FieldAdaptersOutput = ReturnType<typeof arFieldAdaptersCodec.fromInput>;

const arShapeChangeCodec = codec<FieldAdaptersOutput>()((input) => ({
	l0: {
		q1: input.q1l0,
		q2: input.q2l0,
		q3: input.q3l0,
		q4: input.q4l0,
		q5: input.q5l0,
	},
	l1: {
		q1l1: input.l1.q1l1,
		q2l1: input.l1.q2l1,
		q3l1: input.l1.q3l1,
		q4l1: input.l1.q4l1,
		q5l1: input.l1.q5l1,
		l2: {
			q1l2: input.l1.l2.q1l2,
			q2l2: input.l1.l2.q2l2,
			q3l2: input.l1.l2.q3l2,
			q4l2: input.l1.l2.q4l2,
			q5l2: input.l1.l2.q5l2,
		},
		l2_arr: input.l1.l2_arr.map((l2Item) => ({
			q1l2: l2Item.q1l2,
			q2l2: l2Item.q2l2,
			q3l2: l2Item.q3l2,
			q4l2: l2Item.q4l2,
			q5l2: l2Item.q5l2,
			l3_arr: l2Item.l3_arr.map((l3Item) => ({
				q1l2: l3Item.q1l2,
				q2l2: l3Item.q2l2,
				q3l2: l3Item.q3l2,
				q4l2: l3Item.q4l2,
				q5l2: l3Item.q5l2,
			})),
		})),
	},
}))((output) => ({
	q1l0: output.l0.q1,
	q2l0: output.l0.q2,
	q3l0: output.l0.q3,
	q4l0: output.l0.q4,
	q5l0: output.l0.q5,
	l1: {
		q1l1: output.l1.q1l1,
		q2l1: output.l1.q2l1,
		q3l1: output.l1.q3l1,
		q4l1: output.l1.q4l1,
		q5l1: output.l1.q5l1,
		l2: {
			q1l2: output.l1.l2.q1l2,
			q2l2: output.l1.l2.q2l2,
			q3l2: output.l1.l2.q3l2,
			q4l2: output.l1.l2.q4l2,
			q5l2: output.l1.l2.q5l2,
		},
		l2_arr: output.l1.l2_arr.map((l2Item) => ({
			q1l2: l2Item.q1l2,
			q2l2: l2Item.q2l2,
			q3l2: l2Item.q3l2,
			q4l2: l2Item.q4l2,
			q5l2: l2Item.q5l2,
			l3_arr: l2Item.l3_arr.map((l3Item) => ({
				q1l2: l3Item.q1l2,
				q2l2: l3Item.q2l2,
				q3l2: l3Item.q3l2,
				q4l2: l3Item.q4l2,
				q5l2: l3Item.q5l2,
			})),
		})),
	},
}));

export const ArServerToFormCodec = pipeCodecs(
	arFieldAdaptersCodec,
	arShapeChangeCodec,
);
