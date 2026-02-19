import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import { hospitalFieldAdaptersCodec } from "./field-adapters";
import { HospitalFormValidatedSchema } from "./form-validated-schema";
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

export type HospitalForm = ReturnType<
	(typeof HospitalServerToFormCodec)["fromInput"]
>;
