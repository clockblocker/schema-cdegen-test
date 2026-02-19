import type { AuditableBuildingKind, UserRole } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolFormSchema } from "./generated/school/reshape-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import {
	HospitalFormValidatedSchema,
	HospitalFormValidatedSchemaForRole,
	HospitalServerToFormCodec,
} from "./hand-written-codecs/hospital";
import {
	SchoolFormValidatedSchema,
	SchoolFormValidatedSchemaForRole,
	SchoolServerToFormCodec,
} from "./hand-written-codecs/school";
import type { BatteriesRecord } from "./helper-shapes";

export const batteriesFor = {
	Hospital: {
		kind: "Hospital",
		codec: HospitalServerToFormCodec,
		serverSchema: HospitalServerSchema,
		formSchema: HospitalFormSchema,
		formValidatedSchema: HospitalFormValidatedSchema,
		formValidatedSchemaForRole: HospitalFormValidatedSchemaForRole,
	},
	School: {
		kind: "School",
		codec: SchoolServerToFormCodec,
		serverSchema: SchoolServerSchema,
		formSchema: SchoolFormSchema,
		formValidatedSchema: SchoolFormValidatedSchema,
		formValidatedSchemaForRole: SchoolFormValidatedSchemaForRole,
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind, UserRole>;
