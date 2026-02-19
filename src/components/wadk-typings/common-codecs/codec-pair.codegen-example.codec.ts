import { withOutputSchema } from "./codec-pair";
import { ExampleServerToFormCodec } from "./codec-pair.codegen-example";
import { ExampleFormSchema } from "./codec-pair.codegen-example.output-schema";

export const ExampleServerToFormCodecWithSchema = withOutputSchema(
	ExampleServerToFormCodec,
	ExampleFormSchema,
);

export const exampleServerToForm = ExampleServerToFormCodecWithSchema.fromInput;
export const exampleFormToServer = ExampleServerToFormCodecWithSchema.fromOutput;
