import { z } from "zod";
import {
	arrayOf,
	buildAddaptersAndOutputSchema,
	type Codec,
	noOpCodec,
} from "./build-codec";
import { codec, pipeCodecs, type CodecPair } from "./codec-pair";
import { dateToIsoString, isoStringToDate } from "./atomic/date-and-isoString";

export const ReshapeServerSchema = z.object({
	l0_f1: z.string(),
	clients: z.array(
		z.object({
			id: z.number(),
			l1_f1: z.string(),
			counterparties: z.array(
				z.object({
					id: z.number(),
					l2_f1: z.string(),
				}),
			),
		}),
	),
});

export type ReshapeServer = z.infer<typeof ReshapeServerSchema>;

const isoDateNodeCodec = {
	fromInput: (input: string) => isoStringToDate(input),
	fromOutput: (output: Date) => dateToIsoString(output),
	outputSchema: z.date(),
} satisfies Codec<Date, string, z.ZodDate>;

const isoDates = buildAddaptersAndOutputSchema(ReshapeServerSchema, {
	l0_f1: isoDateNodeCodec,
	clients: arrayOf({
		id: noOpCodec,
		l1_f1: isoDateNodeCodec,
		counterparties: arrayOf({
			id: noOpCodec,
			l2_f1: isoDateNodeCodec,
		}),
	}),
});

type IsoDatesOutput = z.infer<typeof isoDates.outputSchema>;

const isoDatesCodec: CodecPair<ReshapeServer, IsoDatesOutput> = {
	fromInput: isoDates.fromInput,
	fromOutput: isoDates.fromOutput,
};

type PartyL1 = {
	id: number;
	l1_f0: Date;
};

type PartyL2 = {
	id: number;
	l2_f0: Date;
};

type ReshapedOutput = {
	l0_f0: Date;
	parties: Array<PartyL1 | PartyL2>;
};

function isL1Party(party: PartyL1 | PartyL2): party is PartyL1 {
	return "l1_f0" in party;
}

const reshapeCodec = codec<IsoDatesOutput>()((input): ReshapedOutput => {
	const parties: Array<PartyL1 | PartyL2> = [];

	for (const client of input.clients) {
		if (client.counterparties.length === 0) {
			parties.push({
				id: client.id,
				l1_f0: client.l1_f1,
			});
			continue;
		}

		for (const counterparty of client.counterparties) {
			parties.push({
				id: counterparty.id,
				l2_f0: counterparty.l2_f1,
			});
		}
	}

	return {
		l0_f0: input.l0_f1,
		parties,
	};
})((output): IsoDatesOutput => {
	// Canonical inverse: l1 party -> client without counterparties; l2 party ->
	// client with one counterparty and mirrored l1 date to satisfy server shape.
	const clients: IsoDatesOutput["clients"] = output.parties.map((party) => {
		if (isL1Party(party)) {
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

export const ReshapeServerToPartiesCodec = pipeCodecs(isoDatesCodec, reshapeCodec);

export type ReshapeOutput = ReturnType<(typeof ReshapeServerToPartiesCodec)["fromInput"]>;
