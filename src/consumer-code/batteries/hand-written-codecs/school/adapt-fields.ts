import { z } from "zod";
import { atomicCodecs } from "~/lib/codec-builder-library/adapter-builder";
import {
	buildLooseAddaptersAndOutputSchema,
	type Codec,
} from "~/lib/codec-builder-library/adapter-builder/build-codec";
import {
	SchoolServerSchema,
	type SchoolServer,
} from "../../generated/school/server-schema";

const { yesNoBool } = atomicCodecs;

type SchoolClassrooms = SchoolServer["classrooms"];
type SchoolFormClassrooms = {
	ids: number[];
	wallColor: string;
};

const schoolClassroomsCodec = {
	fromInput: (classrooms: SchoolClassrooms): SchoolFormClassrooms => {
		const lowestIdClassroom = [...classrooms].sort((a, b) => a.id - b.id)[0];
		return {
			ids: classrooms.map((classroom) => classroom.id),
			wallColor: lowestIdClassroom?.wallColor ?? "",
		};
	},
	fromOutput: (formClassrooms: SchoolFormClassrooms): SchoolClassrooms =>
		formClassrooms.ids.map((id) => ({
			id,
			wallColor: formClassrooms.wallColor,
		})),
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

const schoolFieldCodec = {
	questionsSchool: {
		q3: yesNoBool,
		q4: yesNoBool,
	},
	classrooms: schoolClassroomsCodec,
};

export const schoolFieldAdaptersCodec = buildLooseAddaptersAndOutputSchema(
	SchoolServerSchema,
	schoolFieldCodec,
);
