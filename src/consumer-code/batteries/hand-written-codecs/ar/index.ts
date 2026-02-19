import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { arFieldAdaptersCodec } from "./field-adapters";
import { arReshapeCodec } from "./reshape";

export {
	type ArServer,
	ArServerSchema,
} from "../../generated/ar/server-schema";

export const ArServerToFormCodec = pipeCodecs(
	arFieldAdaptersCodec,
	arReshapeCodec,
);

export type ArForm = ReturnType<(typeof ArServerToFormCodec)["fromInput"]>;
