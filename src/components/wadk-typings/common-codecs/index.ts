import { dateIso } from "./atomic/date-and-isoString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import {
	buildCodecAndFormSchema,
	noOpCodec,
	type Codec,
} from "./build-codec";

export type { Codec };
export { buildCodecAndFormSchema as buildCodec, noOpCodec };

export const atomicCodecs = {
	dateIso,
	nullishEmpty,
	stringNumber,
	yesNoBool,
};
