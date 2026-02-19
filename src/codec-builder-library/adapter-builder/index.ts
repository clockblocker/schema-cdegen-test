import { dateIso } from "./atomic/date-and-isoString";
import {
	countryAndNullishSting,
	currencyAndNullishSting,
	nullableUnionAndNullishStringBuilder,
} from "./atomic/nullableUnion-and-nullishString";
import { nullishEmpty } from "./atomic/nullish-and-empty";
import { stringNumber } from "./atomic/string-and-number";
import { yesNoBool } from "./atomic/yesNo-and-bool";
import {
	arrayOf,
	buildAddaptersAndOutputSchema,
	type Codec,
	noOpCodec,
} from "./build-codec";
import { codec, pipeCodecs, type CodecPair, withOutputSchema } from "./codec-pair";

export type { Codec };
export type { CodecPair };
export { arrayOf, buildAddaptersAndOutputSchema as buildCodec };
export { codec, pipeCodecs, withOutputSchema };

export const atomicCodecs = {
	arrayOf,
	noOpCodec,
	dateIso,
	nullishEmpty,
	nullableUnionAndNullishStringBuilder,
	countryAndNullishSting,
	currencyAndNullishSting,
	stringNumber,
	yesNoBool,
};
