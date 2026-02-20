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
	type Codec,
	noOpCodec,
} from "./build-codec";
import { buildLooseAddaptersAndOutputSchema } from "./build-codec.loose";
import { buildAddaptersAndOutputSchema } from "./build-codec.strict";
import {
	type CodecPair,
	codec,
	pipeCodecs,
	withOutputSchema,
} from "./codec-pair";

export type { Codec };
export type { CodecPair };
export { arrayOf, buildAddaptersAndOutputSchema as buildCodec };
export { buildLooseAddaptersAndOutputSchema };
export { buildLooseAddaptersAndOutputSchema as buildLooseCodec };
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
