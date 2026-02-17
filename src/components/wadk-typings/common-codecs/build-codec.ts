import { z } from "zod";

export interface Codec<
	TServer,
	TForm,
	TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> {
	toForm: (v: TServer) => TForm;
	toServer: (v: TForm) => TServer;
	schema: TSchema;
}

interface NoOpCodec {
	readonly __noOpCodec: true;
}

export const noOpCodec = { __noOpCodec: true } as const satisfies NoOpCodec;

type RuntimeCodecShape = Record<string, unknown>;

type ServerShapeOf<TServerSchema extends z.AnyZodObject> =
	TServerSchema extends z.ZodObject<infer TShape, any, any, any, any>
		? TShape
		: never;

type UnwrapObjectSchema<TSchema extends z.ZodTypeAny> =
	TSchema extends z.ZodOptional<infer TInner>
		? UnwrapObjectSchema<TInner>
		: TSchema extends z.ZodNullable<infer TInner>
			? UnwrapObjectSchema<TInner>
			: TSchema extends z.AnyZodObject
				? TSchema
				: never;

type ShapeOfObjectSchema<TSchema extends z.AnyZodObject> =
	TSchema extends z.ZodObject<infer TShape, any, any, any, any>
		? TShape
		: never;

type NestedServerShape<TSchema extends z.ZodTypeAny> =
	UnwrapObjectSchema<TSchema> extends z.AnyZodObject
		? ShapeOfObjectSchema<UnwrapObjectSchema<TSchema>>
		: never;

type CodecShapeForServerShape<TServerShape extends z.ZodRawShape> = {
	[K in keyof TServerShape]: NestedServerShape<TServerShape[K]> extends never
		? Codec<any, any, any> | NoOpCodec
		: CodecShapeForServerShape<NestedServerShape<TServerShape[K]>>;
};

type FormZodNode<
	TServerField extends z.ZodTypeAny,
	TShapeNode,
> = TShapeNode extends Codec<any, any, infer TSchema>
	? TSchema
	: TShapeNode extends NoOpCodec
		? TServerField
		: TShapeNode extends Record<string, any>
			? z.ZodObject<
					FormZodShapeForServerShape<
						NestedServerShape<TServerField>,
						TShapeNode &
							CodecShapeForServerShape<NestedServerShape<TServerField>>
					>
				>
			: never;

type FormZodShapeForServerShape<
	TServerShape extends z.ZodRawShape,
	S extends CodecShapeForServerShape<TServerShape>,
> = {
	[K in keyof S]: K extends keyof TServerShape
		? TServerShape[K] extends z.ZodTypeAny
			? FormZodNode<TServerShape[K], S[K]>
			: never
		: never;
};

function isCodec(v: unknown): v is Codec<any, any, any> {
	return (
		typeof v === "object" &&
		v !== null &&
		"toForm" in v &&
		"toServer" in v &&
		"schema" in v
	);
}

function isNoOpCodec(v: unknown): v is NoOpCodec {
	return (
		typeof v === "object" &&
		v !== null &&
		"__noOpCodec" in v &&
		(v as NoOpCodec).__noOpCodec === true
	);
}

function getNestedObjectSchema(schema: z.ZodTypeAny): z.AnyZodObject {
	let current: z.ZodTypeAny = schema;
	while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
		current = current.unwrap();
	}

	if (!(current instanceof z.ZodObject)) {
		throw new Error("Codec shape does not match server schema at a nested key.");
	}

	return current;
}

function buildFormZodShape(
	shape: RuntimeCodecShape,
	serverShape: z.ZodRawShape,
): Record<string, z.ZodTypeAny> {
	const result: Record<string, z.ZodTypeAny> = {};
	for (const key in shape) {
		const node = shape[key];
		const serverNode = serverShape[key];
		if (!serverNode) {
			throw new Error(`Codec shape key "${key}" is not in server schema.`);
		}

		if (isCodec(node)) {
			result[key] = node.schema;
		} else if (isNoOpCodec(node)) {
			result[key] = serverNode;
		} else {
			const nestedServer = getNestedObjectSchema(serverNode);
			result[key] = z.object(
				buildFormZodShape(node as RuntimeCodecShape, nestedServer.shape),
			);
		}
	}
	return result;
}

function convertToForm(
	shape: RuntimeCodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.toForm(data[key]);
		} else if (isNoOpCodec(node)) {
			result[key] = data[key];
		} else {
			result[key] = convertToForm(
				node as RuntimeCodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}
	return result;
}

function convertToServer(
	shape: RuntimeCodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.toServer(data[key]);
		} else if (isNoOpCodec(node)) {
			result[key] = data[key];
		} else {
			result[key] = convertToServer(
				node as RuntimeCodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}

	return result;
}

export function buildCodecAndFormSchema<
	TServerSchema extends z.AnyZodObject,
	const S extends CodecShapeForServerShape<ServerShapeOf<TServerSchema>>,
>(
	serverSchema: TServerSchema,
	shape: S,
) {
	const formSchema = z.object(
		buildFormZodShape(shape as RuntimeCodecShape, serverSchema.shape as z.ZodRawShape),
	) as z.ZodObject<
		FormZodShapeForServerShape<ServerShapeOf<TServerSchema>, S>
	>;

	type ServerType = z.infer<TServerSchema>;
	type FormType = z.infer<typeof formSchema>;

	const toForm = (data: ServerType): FormType => {
		return convertToForm(
			shape as RuntimeCodecShape,
			data as Record<string, unknown>,
		) as FormType;
	};

	const toServer = (data: FormType): ServerType => {
		return convertToServer(
			shape as RuntimeCodecShape,
			data as Record<string, unknown>,
		) as ServerType;
	};

	return { formSchema, toForm, toServer };
}
