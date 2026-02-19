import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { schoolFieldAdaptersCodec } from "./field-adapters";
import { schoolReshapeCodec } from "./reshape";

export {
	type SchoolServer,
	SchoolServerSchema,
} from "../../generated/school/server-schema";

export const SchoolServerToFormCodec = pipeCodecs(
	schoolFieldAdaptersCodec,
	schoolReshapeCodec,
);

export type SchoolForm = ReturnType<
	(typeof SchoolServerToFormCodec)["fromInput"]
>;
