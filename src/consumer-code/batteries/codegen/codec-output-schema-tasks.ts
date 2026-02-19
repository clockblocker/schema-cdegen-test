import type { CodecOutputSchemaConfigRecord } from "~/codec-builder-library/codegen/generate-codec-output-schema";

export const codecOutputSchemaTasks = {
	hospital: {
		entry: "src/consumer-code/batteries/batteries.ts",
		codecExportName: "HospitalServerToFormCodec",
		schemaName: "HospitalFormSchema",
		out: "src/consumer-code/batteries/generated/hospital/reshape-schema.ts",
	},
	school: {
		entry: "src/consumer-code/batteries/batteries.ts",
		codecExportName: "SchoolServerToFormCodec",
		schemaName: "SchoolFormSchema",
		out: "src/consumer-code/batteries/generated/school/reshape-schema.ts",
	},
} as const satisfies CodecOutputSchemaConfigRecord;
