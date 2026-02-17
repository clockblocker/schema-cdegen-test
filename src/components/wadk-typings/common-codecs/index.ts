import { dateIso } from "./atomic/date-and-isoString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import {
	arrayOf,
	buildCodecAndFormSchema,
	noOpCodec,
	type Codec,
} from "./build-codec";

export type { Codec };
export { arrayOf, buildCodecAndFormSchema as buildCodec };

export const atomicCodecs = {
	arrayOf,
	noOpCodec,
	dateIso,
	nullishEmpty,
	stringNumber,
	yesNoBool,
};
