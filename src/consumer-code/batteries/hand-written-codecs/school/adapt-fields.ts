import { atomicCodecs } from "~/lib/codec-builder-library/adapter-builder";
import { buildLooseAddaptersAndOutputSchema } from "~/lib/codec-builder-library/adapter-builder/build-codec";
import { SchoolServerSchema } from "../../generated/school/server-schema";
import { schoolClassroomsCodec } from "./custom-field-codecs/school-classrooms-codec";

const { yesNoBool } = atomicCodecs;

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
