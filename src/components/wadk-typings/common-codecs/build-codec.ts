import { z } from "zod";

export interface Codec<
	Output,
	Input,
	TSchema extends z.ZodTypeAny = z.ZodTypeAny,
> {
	fromInput: (v: Input) => Output;
	fromOutput: (v: Output) => Input;
	outputSchema: TSchema;
}

interface NoOpCodec {
	readonly __noOpCodec: true;
}

export const noOpCodec = { __noOpCodec: true } as const satisfies NoOpCodec;

type RuntimeCodecShape = Record<string, unknown>;

type SchemaShapeOf<TSchema extends z.AnyZodObject> =
	TSchema extends z.ZodObject<infer TShape, any, any, any, any>
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

type NestedSchemaShape<TSchema extends z.ZodTypeAny> =
	UnwrapObjectSchema<TSchema> extends z.AnyZodObject
		? ShapeOfObjectSchema<UnwrapObjectSchema<TSchema>>
		: never;

type CodecShapeForSchemaShape<TShape extends z.ZodRawShape> = {
	[K in keyof TShape]: NestedSchemaShape<TShape[K]> extends never
		? Codec<any, any, any> | NoOpCodec
		: CodecShapeForSchemaShape<NestedSchemaShape<TShape[K]>>;
};

type OutputZodNode<
	TInputField extends z.ZodTypeAny,
	TShapeNode,
> = TShapeNode extends Codec<any, any, infer TSchema>
	? TSchema
	: TShapeNode extends NoOpCodec
		? TInputField
		: TShapeNode extends Record<string, any>
			? z.ZodObject<
					OutputZodShapeForSchemaShape<
						NestedSchemaShape<TInputField>,
						TShapeNode &
							CodecShapeForSchemaShape<NestedSchemaShape<TInputField>>
					>
				>
			: never;

type OutputZodShapeForSchemaShape<
	TShape extends z.ZodRawShape,
	S extends CodecShapeForSchemaShape<TShape>,
> = {
	[K in keyof S]: K extends keyof TShape
		? TShape[K] extends z.ZodTypeAny
			? OutputZodNode<TShape[K], S[K]>
			: never
		: never;
};

function isCodec(v: unknown): v is Codec<any, any, any> {
	return (
		typeof v === "object" &&
		v !== null &&
		"fromInput" in v &&
		"fromOutput" in v &&
		"outputSchema" in v
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
		throw new Error("Codec shape does not match nested object schema.");
	}

	return current;
}

function buildOutputZodShape(
	shape: RuntimeCodecShape,
	schemaShape: z.ZodRawShape,
): Record<string, z.ZodTypeAny> {
	const result: Record<string, z.ZodTypeAny> = {};
	for (const key in shape) {
		const node = shape[key];
		const schemaNode = schemaShape[key];
		if (!schemaNode) {
			throw new Error(`Codec shape key "${key}" is not in schema.`);
		}

		if (isCodec(node)) {
			result[key] = node.outputSchema;
		} else if (isNoOpCodec(node)) {
			result[key] = schemaNode;
		} else {
			const nestedObjectSchema = getNestedObjectSchema(schemaNode);
			result[key] = z.object(
				buildOutputZodShape(node as RuntimeCodecShape, nestedObjectSchema.shape),
			);
		}
	}
	return result;
}

function convertFromInput(
	shape: RuntimeCodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.fromInput(data[key]);
		} else if (isNoOpCodec(node)) {
			result[key] = data[key];
		} else {
			result[key] = convertFromInput(
				node as RuntimeCodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}
	return result;
}

function convertFromOutput(
	shape: RuntimeCodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.fromOutput(data[key]);
		} else if (isNoOpCodec(node)) {
			result[key] = data[key];
		} else {
			result[key] = convertFromOutput(
				node as RuntimeCodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}

	return result;
}

export function buildCodecAndFormSchema<
	TInputSchema extends z.AnyZodObject,
	const S extends CodecShapeForSchemaShape<SchemaShapeOf<TInputSchema>>,
>(
	inputSchema: TInputSchema,
	shape: S,
) {
	const outputSchema = z.object(
		buildOutputZodShape(shape as RuntimeCodecShape, inputSchema.shape as z.ZodRawShape),
	) as z.ZodObject<
		OutputZodShapeForSchemaShape<SchemaShapeOf<TInputSchema>, S>
	>;

	type InputType = z.infer<TInputSchema>;
	type OutputType = z.infer<typeof outputSchema>;

	const fromInput = (data: InputType): OutputType => {
		return convertFromInput(
			shape as RuntimeCodecShape,
			data as Record<string, unknown>,
		) as OutputType;
	};

	const fromOutput = (data: OutputType): InputType => {
		return convertFromOutput(
			shape as RuntimeCodecShape,
			data as Record<string, unknown>,
		) as InputType;
	};

	return {
		outputSchema,
		fromInput,
		fromOutput,
		// Backward-compatible aliases
		formSchema: outputSchema,
		toForm: fromInput,
		toServer: fromOutput,
	};
}
