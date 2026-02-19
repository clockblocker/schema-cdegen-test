import type { z } from "zod";
import { atomicCodecs } from "~/codec-builder-library/adapter-builder";
import { buildAddaptersAndOutputSchema } from "~/codec-builder-library/adapter-builder/build-codec";
import { SchoolServerSchema } from "../server/school-server";

const school = buildAddaptersAndOutputSchema(SchoolServerSchema(), {
	questionsSchool: {
		q3: atomicCodecs.yesNoBool,
		q4: atomicCodecs.yesNoBool,
	},
});

export const SchoolFormSchema = school.outputSchema;
export const schoolServerToForm = school.fromInput;
export const schoolFormToServer = school.fromOutput;
export type SchoolForm = z.infer<typeof SchoolFormSchema>;
