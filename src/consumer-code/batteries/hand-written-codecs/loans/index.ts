import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { loansFieldAdaptersCodec } from "./field-adapters";
import { loansReshapeCodec } from "./reshape";

export {
	type LoansServer,
	LoansServerSchema,
} from "../../generated/loans/server-schema";

export const LoansServerToFormCodec = pipeCodecs(
	loansFieldAdaptersCodec,
	loansReshapeCodec,
);

export type LoansForm = ReturnType<
	(typeof LoansServerToFormCodec)["fromInput"]
>;
