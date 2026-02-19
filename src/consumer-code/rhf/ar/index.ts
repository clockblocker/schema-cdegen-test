import { ArFormSchema } from "../../adapters/generated/ar/reshape-schema";
import { ArServerToFormCodec } from "../../adapters/hand-written-codecs/ar";

export const arRHF = {
	flavor: "AR" as const,
	schema: ArFormSchema,
	fromServer: ArServerToFormCodec.fromInput,
	toServer: ArServerToFormCodec.fromOutput,
};

export type ArServerInput = Parameters<typeof arRHF.fromServer>[0];
export type ArFormOutput = ReturnType<typeof arRHF.fromServer>;
