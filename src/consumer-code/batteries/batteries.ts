import type { AuditableBuildingKind } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolFormSchema } from "./generated/school/reshape-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import { HospitalServerToFormCodec } from "./hand-written-codecs/hospital";
import { SchoolServerToFormCodec } from "./hand-written-codecs/school";
import type { BatteriesRecord } from "./helper-shapes";

export const batteriesFor = {
	Hospital: {
		kind: "Hospital",
		codec: HospitalServerToFormCodec,
		serverSchema: HospitalServerSchema,
		formSchema: HospitalFormSchema,
	},
	School: {
		kind: "School",
		codec: SchoolServerToFormCodec,
		serverSchema: SchoolServerSchema,
		formSchema: SchoolFormSchema,
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind>;
