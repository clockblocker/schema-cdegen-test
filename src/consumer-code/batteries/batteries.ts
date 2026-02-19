import { zodResolver } from "@hookform/resolvers/zod";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import {
	HospitalFormValidatedSchemaForRole,
	HospitalServerToFormCodec,
} from "./hand-written-codecs/hospital";
import {
	SchoolFormValidatedSchemaForRole,
	SchoolServerToFormCodec,
} from "./hand-written-codecs/school";
import type { BatteriesRecord } from "./helper-shapes";

export const batteriesFor = {
	Hospital: {
		kind: "Hospital",
		codec: HospitalServerToFormCodec,
		serverSchema: HospitalServerSchema,
		formResolverForRole: {
			Electrician: zodResolver(HospitalFormValidatedSchemaForRole.Electrician),
			Plumber: zodResolver(HospitalFormValidatedSchemaForRole.Plumber),
		},
	},
	School: {
		kind: "School",
		codec: SchoolServerToFormCodec,
		serverSchema: SchoolServerSchema,
		formResolverForRole: {
			Electrician: zodResolver(SchoolFormValidatedSchemaForRole.Electrician),
			Plumber: zodResolver(SchoolFormValidatedSchemaForRole.Plumber),
		},
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind, UserRole>;
