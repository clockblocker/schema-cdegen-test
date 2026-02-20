import { pipeCodecs } from "~/lib/codec-builder-library/adapter-builder";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { LibraryServerSchema } from "./generated/library/server-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import { hospitalFieldAdaptersCodec } from "./hand-written-codecs/hospital/adapt-fields";
import { hospitalReshapeCodec } from "./hand-written-codecs/hospital/reshape";
import { HospitalFormValidatedSchemaForRole } from "./hand-written-codecs/hospital/validate";
import { LibraryCodec, LibraryFormSchema } from "./hand-written-codecs/library/reshape-wo-codegen";
import { LibraryFormValidatedSchemaForRole } from "./hand-written-codecs/library/validate";
import {
	SchoolCodec,
	SchoolFormSchema,
} from "./hand-written-codecs/school/adapt-fields";
import { SchoolFormValidatedSchemaForRole } from "./hand-written-codecs/school/validate";
import type { BatteriesRecord } from "./type-constraint/batteries-shape";

export const HospitalServerToFormCodec = pipeCodecs(
	hospitalFieldAdaptersCodec,
	hospitalReshapeCodec,
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
		codec: SchoolCodec,
		serverSchema: SchoolServerSchema,
		formSchema: SchoolFormSchema,
		formValidatedSchemaForRole: SchoolFormValidatedSchemaForRole,
	},
	Library: {
		kind: "Library",
		codec: LibraryCodec,
		serverSchema: LibraryServerSchema,
		formSchema: LibraryFormSchema,
		formValidatedSchemaForRole: LibraryFormValidatedSchemaForRole,
	},
} as const satisfies BatteriesRecord<AuditableBuildingKind, UserRole>;
