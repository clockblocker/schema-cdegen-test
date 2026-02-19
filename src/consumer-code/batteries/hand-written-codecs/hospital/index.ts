import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { hospitalFieldAdaptersCodec } from "./field-adapters";
import { HospitalFormValidatedSchema } from "./form-validated-schema";
import { HospitalFormValidatedSchemaForRole } from "./form-validated-schema-for-role";
import { hospitalReshapeCodec } from "./reshape";

export {
	type HospitalServer,
	HospitalServerSchema,
} from "../../generated/hospital/server-schema";

export const HospitalServerToFormCodec = pipeCodecs(
	hospitalFieldAdaptersCodec,
	hospitalReshapeCodec,
);

export { HospitalFormValidatedSchema };
export { HospitalFormValidatedSchemaForRole };

export type HospitalForm = ReturnType<
	(typeof HospitalServerToFormCodec)["fromInput"]
>;
