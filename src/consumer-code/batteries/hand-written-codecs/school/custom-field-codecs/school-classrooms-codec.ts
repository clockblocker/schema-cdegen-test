import { z } from "zod";
import type { Codec } from "~/lib/codec-builder-library/adapter-builder/build-codec";
import type { SchoolServer } from "../../../generated/school/server-schema";

type SchoolClassrooms = SchoolServer["classrooms"];
type SchoolFormClassrooms = {
	ids: number[];
	wallColor: string;
};

function classroomsToFormClassrooms(
	classrooms: SchoolClassrooms,
): SchoolFormClassrooms {
	const lowestIdClassroom = [...classrooms].sort((a, b) => a.id - b.id)[0];
	return {
		ids: classrooms.map((classroom) => classroom.id),
		wallColor: lowestIdClassroom?.wallColor ?? "",
	};
}

function formClassroomsToClassrooms(
	formClassrooms: SchoolFormClassrooms,
): SchoolClassrooms {
	return formClassrooms.ids.map((id) => ({
		id,
		wallColor: formClassrooms.wallColor,
	}));
}

export const schoolClassroomsCodec = {
	fromInput: classroomsToFormClassrooms,
	fromOutput: formClassroomsToClassrooms,
	outputSchema: z.object({
		ids: z.array(z.number()),
		wallColor: z.string(),
	}),
} satisfies Codec<
	SchoolFormClassrooms,
	SchoolClassrooms,
	z.ZodObject<{
		ids: z.ZodArray<z.ZodNumber>;
		wallColor: z.ZodString;
	}>
>;
