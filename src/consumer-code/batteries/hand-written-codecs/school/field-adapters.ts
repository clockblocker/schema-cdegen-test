import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { SchoolServerSchema } from "../../generated/school/server-schema";

const { yesNoBool } = atomicCodecs;

const schoolFieldCodec = {
	questionsSchool: {
		q3: yesNoBool,
		q4: yesNoBool,
	},
};

export const schoolFieldAdaptersCodec = buildAddaptersAndOutputSchema(
	SchoolServerSchema,
	schoolFieldCodec,
);
