import type { z } from "zod";

type CodecLike<
	TServerSchema extends z.ZodTypeAny,
	TFormSchema extends z.ZodTypeAny,
> = {
	fromInput(input: z.infer<TServerSchema>): z.infer<TFormSchema>;
	fromOutput(output: z.infer<TFormSchema>): z.infer<TServerSchema>;
};

type ScoringBattery<
	TFlavor extends string,
	TServerSchema extends z.ZodTypeAny,
	TFormSchema extends z.ZodTypeAny,
	TCodec extends CodecLike<TServerSchema, TFormSchema>,
> = {
	flavor: TFlavor;
	codec: TCodec;
	serverSchema: TServerSchema;
	formSchema: TFormSchema;
};

export type BatteriesRecord<TFlavor extends string> = Record<
	TFlavor,
	ScoringBattery<
		TFlavor,
		z.ZodTypeAny,
		z.ZodTypeAny,
		CodecLike<z.ZodTypeAny, z.ZodTypeAny>
	>
>;

type IsMutuallyAssignable<TA, TB> = [TA] extends [TB]
	? [TB] extends [TA]
		? true
		: false
	: false;

export type Assert<T extends true> = T;

export type IsMutualByFlavor<
	TFlavor extends string,
	TLeft extends Record<TFlavor, unknown>,
	TRight extends Record<TFlavor, unknown>,
> = {
	[K in TFlavor]: IsMutuallyAssignable<TLeft[K], TRight[K]>;
}[TFlavor] extends true
	? true
	: false;
