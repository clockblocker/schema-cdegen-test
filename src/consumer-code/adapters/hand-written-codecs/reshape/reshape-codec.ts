import { codec, pipeCodecs } from "../../../../components/wadk-typings/common-codecs/codec-pair";
import { buildReshapeAtomicsCodec } from "../../../../components/wadk-typings/common-codecs/reshape/atomics-codec";
import { ReshapeServerSchema } from "../../generated/reshape/server-schema";

const reshapeAtomicsCodec = buildReshapeAtomicsCodec(ReshapeServerSchema);
type ReshapeAtomicsOutput = ReturnType<typeof reshapeAtomicsCodec.fromInput>;

const l1Party = (id: number, l1_f0: Date) => ({ id, l1_f0 });
const l2Party = (id: number, l2_f0: Date) => ({ id, l2_f0 });

const reshapeCodec = codec<ReshapeAtomicsOutput>()((input) => {
	const parties: Array<ReturnType<typeof l1Party> | ReturnType<typeof l2Party>> =
		[];
	for (const client of input.clients) {
		if (client.counterparties.length === 0) {
			parties.push(l1Party(client.id, client.l1_f1));
			continue;
		}

		for (const counterparty of client.counterparties) {
			parties.push(l2Party(counterparty.id, counterparty.l2_f1));
		}
	}

	return {
		l0_f0: input.l0_f1,
		parties,
	};
})((output): ReshapeAtomicsOutput => {
	const clients: ReshapeAtomicsOutput["clients"] = output.parties.map((party) => {
		if ("l1_f0" in party) {
			return {
				id: party.id,
				l1_f1: party.l1_f0,
				counterparties: [],
			};
		}

		return {
			id: party.id,
			l1_f1: party.l2_f0,
			counterparties: [{ id: party.id, l2_f1: party.l2_f0 }],
		};
	});

	return {
		l0_f1: output.l0_f0,
		clients,
	};
});

export const ReshapeServerToPartiesCodec = pipeCodecs(
	reshapeAtomicsCodec,
	reshapeCodec,
);

export type ReshapeOutput = ReturnType<(typeof ReshapeServerToPartiesCodec)["fromInput"]>;
