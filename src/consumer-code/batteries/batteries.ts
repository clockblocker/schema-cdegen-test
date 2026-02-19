import type { AuditableBuildingKind } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolFormSchema } from "./generated/school/reshape-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import {
	HospitalFormValidatedSchema,
	HospitalServerToFormCodec,
} from "./hand-written-codecs/hospital";
import {
	SchoolFormValidatedSchema,
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
	},
	School: {
		kind: "School",
		codec: SchoolServerToFormCodec,
		serverSchema: SchoolServerSchema,
		formSchema: SchoolFormSchema,
		formValidatedSchema: SchoolFormValidatedSchema,
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind>;
