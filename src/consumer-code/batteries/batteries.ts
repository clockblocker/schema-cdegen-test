import { pipeCodecs } from "~/codec-builder-library/adapter-builder";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolFormSchema } from "./generated/school/reshape-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import { hospitalFieldAdaptersCodec } from "./hand-written-codecs/hospital/adapt-fields";
import { HospitalFormValidatedSchemaForRole } from "./hand-written-codecs/hospital/validate";
import { hospitalReshapeCodec } from "./hand-written-codecs/hospital/reshape";
import { schoolFieldAdaptersCodec } from "./hand-written-codecs/school/adapt-fields";
import { SchoolFormValidatedSchemaForRole } from "./hand-written-codecs/school/validate";
import { schoolReshapeCodec } from "./hand-written-codecs/school/reshape";
import type { BatteriesRecord } from "./type-constraint/batteries-shape";

export const HospitalServerToFormCodec = pipeCodecs(
	hospitalFieldAdaptersCodec,
	hospitalReshapeCodec,
);

export const SchoolServerToFormCodec = pipeCodecs(
	schoolFieldAdaptersCodec,
	schoolReshapeCodec,
);

export const batteriesFor = {
	Hospital: {
		kind: "Hospital",
		codec: HospitalServerToFormCodec,
		serverSchema: HospitalServerSchema,
		formSchema: HospitalFormSchema,
		formValidatedSchemaForRole: HospitalFormValidatedSchemaForRole,
	},
	School: {
		kind: "School",
		codec: SchoolServerToFormCodec,
		serverSchema: SchoolServerSchema,
		formSchema: SchoolFormSchema,
		formValidatedSchemaForRole: SchoolFormValidatedSchemaForRole,
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind, UserRole>;
