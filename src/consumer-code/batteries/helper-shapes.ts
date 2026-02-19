import type { z } from "zod";

type CodecLike<
	TServerSchema extends z.ZodTypeAny,
	TFormSchema extends z.ZodTypeAny,
> = {
	fromInput(input: z.infer<TServerSchema>): z.infer<TFormSchema>;
	fromOutput(output: z.infer<TFormSchema>): z.infer<TServerSchema>;
};

type AudutBattery<
	TKind extends string,
	TServerSchema extends z.ZodTypeAny,
	TFormSchema extends z.ZodTypeAny,
	TCodec extends CodecLike<TServerSchema, TFormSchema>,
> = {
	kind: TKind;
	codec: TCodec;
	serverSchema: TServerSchema;
	formSchema: TFormSchema;
};

export type BatteriesRecord<TKind extends string> = Record<
	TKind,
	AudutBattery<
		TKind,
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

export type IsMutualByKind<
	TKind extends string,
	TLeft extends Record<TKind, unknown>,
	TRight extends Record<TKind, unknown>,
> = {
	[K in TKind]: IsMutuallyAssignable<TLeft[K], TRight[K]>;
}[TKind] extends true
	? true
	: false;
