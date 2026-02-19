import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { schoolFieldAdaptersCodec } from "./field-adapters";
import { SchoolFormValidatedSchema } from "./form-validated-schema";
import { SchoolFormValidatedSchemaForRole } from "./form-validated-schema-for-role";
import { schoolReshapeCodec } from "./reshape";

export {
	type SchoolServer,
	SchoolServerSchema,
} from "../../generated/school/server-schema";

export const SchoolServerToFormCodec = pipeCodecs(
	schoolFieldAdaptersCodec,
	schoolReshapeCodec,
);

export { SchoolFormValidatedSchema };
export { SchoolFormValidatedSchemaForRole };

export type SchoolForm = ReturnType<
	(typeof SchoolServerToFormCodec)["fromInput"]
>;
