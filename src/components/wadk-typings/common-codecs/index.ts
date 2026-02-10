import { dateIso } from "./atomic/date-and-isoString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import { buildCodec, type Codec } from "./build-codec";

export type { Codec };
export { buildCodec };

export const atomicCodecs = {
	dateIso,
	nullishEmpty,
	stringNumber,
	yesNoBool,
};
