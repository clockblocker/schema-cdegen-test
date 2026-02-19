import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import type { z } from "zod";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import { HospitalFormSchema } from "./generated/hospital/reshape-schema";
import { HospitalServerSchema } from "./generated/hospital/server-schema";
import { SchoolFormSchema } from "./generated/school/reshape-schema";
import { SchoolServerSchema } from "./generated/school/server-schema";
import {
	HospitalFormValidatedSchemaForRole,
	HospitalServerToFormCodec,
} from "./hand-written-codecs/hospital";
import {
	SchoolFormValidatedSchemaForRole,
	SchoolServerToFormCodec,
} from "./hand-written-codecs/school";
import type { BatteriesRecord, FormResolverContext } from "./helper-shapes";

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
