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
	buildEvenLooserAddaptersAndOutputSchema,
	buildLooseAddaptersAndOutputSchema,
	type Codec,
	fromPath,
	fromPaths,
	removeField,
	reshapeFor,
	type ReshapeShapeFor,
	type SchemaPathTuple,
	noOpCodec,
} from "./build-codec";
import {
	type CodecPair,
	codec,
	pipeCodecs,
	withOutputSchema,
} from "./codec-pair";

export type { Codec };
export type { CodecPair };
export type { ReshapeShapeFor, SchemaPathTuple };
export {
	arrayOf,
	fromPath,
	fromPaths,
	removeField,
	reshapeFor,
	buildEvenLooserAddaptersAndOutputSchema,
	buildLooseAddaptersAndOutputSchema,
	buildAddaptersAndOutputSchema,
};

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
