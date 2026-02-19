import type { Resolver } from "react-hook-form";
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
	TRole extends string,
	TServerSchema extends z.ZodTypeAny,
	TFormDraftSchema extends z.ZodTypeAny,
	TCodec extends CodecLike<TServerSchema, TFormDraftSchema>,
> = {
	kind: TKind;
	codec: TCodec;
	serverSchema: TServerSchema;
	formResolverForRole: Record<
		TRole,
		Resolver<z.input<TFormDraftSchema>, unknown, z.output<TFormDraftSchema>>
	>;
};

export type BatteriesRecord<
	TKind extends string,
	TRole extends string,
> = Record<
	TKind,
	AudutBattery<
		TKind,
		TRole,
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

export type IsAssignableByKind<
	TKind extends string,
	TFrom extends Record<TKind, unknown>,
	TTo extends Record<TKind, unknown>,
> = {
	[K in TKind]: [TFrom[K]] extends [TTo[K]] ? true : false;
}[TKind] extends true
	? true
	: false;
