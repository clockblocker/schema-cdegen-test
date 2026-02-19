import { z } from "zod";
import { ArFormSchema } from "./generated/ar/reshape-schema";
import { ArServerSchema } from "./generated/ar/server-schema";
import { LoansFormSchema } from "./generated/loans/reshape-schema";
import { LoansServerSchema } from "./generated/loans/server-schema";
import { ArServerToFormCodec } from "./hand-written-codecs/ar";
import { LoansServerToFormCodec } from "./hand-written-codecs/loans";

type CodecLike<I, O> = {
	fromInput: (input: I) => O;
	fromOutput: (output: O) => I;
};

type CodecInput<TCodec> = TCodec extends CodecLike<infer I, any> ? I : never;
type CodecOutput<TCodec> = TCodec extends CodecLike<any, infer O> ? O : never;

type KeysWithUndefined<T> = {
	[K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type OptionalizeUndefined<T> = T extends Date
	? Date
	: T extends readonly (infer TItem)[]
		? OptionalizeUndefined<TItem>[]
		: T extends object
			? {
					[K in Exclude<keyof T, KeysWithUndefined<T>>]: OptionalizeUndefined<T[K]>;
				} & {
					[K in KeysWithUndefined<T>]?: OptionalizeUndefined<
						Exclude<T[K], undefined>
					>;
				}
			: T;

type ScoringBattery<
	TFlavor extends string,
	TCodec extends CodecLike<any, any>,
> = {
	flavor: TFlavor;
	codec: TCodec;
	serverSchema: z.ZodType<CodecInput<TCodec>, z.ZodTypeDef, any>;
	formSchema: z.ZodType<OptionalizeUndefined<CodecOutput<TCodec>>, z.ZodTypeDef, any>;
};

export const arBattery = {
	flavor: "AR",
	codec: ArServerToFormCodec,
	serverSchema: ArServerSchema,
	formSchema: ArFormSchema,
} as const satisfies ScoringBattery<"AR", typeof ArServerToFormCodec>;

export const loansBattery = {
	flavor: "Loans",
	codec: LoansServerToFormCodec,
	serverSchema: LoansServerSchema,
	formSchema: LoansFormSchema,
} as const satisfies ScoringBattery<"Loans", typeof LoansServerToFormCodec>;

export const scoringBatteries = {
	AR: arBattery,
	Loans: loansBattery,
} as const;

export type Flavor = keyof typeof scoringBatteries;

export type Scoring<F extends Flavor> = OptionalizeUndefined<
	CodecOutput<(typeof scoringBatteries)[F]["codec"]>
>;

export type ScoringServerInput<F extends Flavor> = CodecInput<
	(typeof scoringBatteries)[F]["codec"]
>;

export type ScoringFromSchema = {
	[F in Flavor]: z.infer<(typeof scoringBatteries)[F]["formSchema"]>;
};

type IsMutuallyAssignable<TA, TB> = [TA] extends [TB]
	? [TB] extends [TA]
		? true
		: false
	: false;

type Assert<T extends true> = T;

type _arScoringMatchesSchema = Assert<
	IsMutuallyAssignable<ScoringFromSchema["AR"], Scoring<"AR">>
>;
type _loansScoringMatchesSchema = Assert<
	IsMutuallyAssignable<ScoringFromSchema["Loans"], Scoring<"Loans">>
>;
