import { withOutputSchema } from "./codec-pair";
import { ReshapeServerToPartiesCodec } from "./codec-pair.reshape-example";
import { ReshapeOutputSchema } from "./codec-pair.reshape-example.output-schema";

export const ReshapeServerToPartiesCodecWithSchema = withOutputSchema(
	ReshapeServerToPartiesCodec,
	ReshapeOutputSchema,
);

export const reshapeServerToOutput = ReshapeServerToPartiesCodecWithSchema.fromInput;
export const reshapeOutputToServer = ReshapeServerToPartiesCodecWithSchema.fromOutput;
