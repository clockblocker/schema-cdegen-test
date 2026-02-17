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

interface ArrayCodecShape<TItemShape extends RuntimeCodecShape = RuntimeCodecShape> {
	readonly __arrayCodecShape: true;
	readonly itemShape: TItemShape;
}

export function arrayOf<const TItemShape extends RuntimeCodecShape>(
	itemShape: TItemShape,
): ArrayCodecShape<TItemShape> {
	return { __arrayCodecShape: true, itemShape };
}

type SchemaShapeOf<TSchema extends z.AnyZodObject> =
	TSchema extends z.ZodObject<infer TShape, any, any, any, any>
		? TShape
		: never;

type UnwrapOptionalNullableSchema<TSchema extends z.ZodTypeAny> =
	TSchema extends z.ZodOptional<infer TInner>
		? UnwrapOptionalNullableSchema<TInner>
		: TSchema extends z.ZodNullable<infer TInner>
			? UnwrapOptionalNullableSchema<TInner>
			: TSchema;

type ObjectSchemaOf<TSchema extends z.ZodTypeAny> =
	UnwrapOptionalNullableSchema<TSchema> extends z.AnyZodObject
		? UnwrapOptionalNullableSchema<TSchema>
		: never;

type ShapeOfObjectSchema<TSchema extends z.AnyZodObject> =
	TSchema extends z.ZodObject<infer TShape, any, any, any, any>
		? TShape
		: never;

type NestedSchemaShape<TSchema extends z.ZodTypeAny> =
	ObjectSchemaOf<TSchema> extends z.AnyZodObject
		? ShapeOfObjectSchema<ObjectSchemaOf<TSchema>>
		: never;

type ArrayItemSchemaOf<TSchema extends z.ZodTypeAny> =
	UnwrapOptionalNullableSchema<TSchema> extends z.ZodArray<infer TItem, any>
		? TItem
		: never;

type ArrayItemSchemaShape<TSchema extends z.ZodTypeAny> =
	ArrayItemSchemaOf<TSchema> extends z.ZodTypeAny
		? NestedSchemaShape<ArrayItemSchemaOf<TSchema>>
		: never;

type CodecShapeForSchemaShape<TShape extends z.ZodRawShape> = {
	[K in keyof TShape]: ArrayItemSchemaShape<TShape[K]> extends never
		? NestedSchemaShape<TShape[K]> extends never
			? Codec<any, any, any> | NoOpCodec
			: CodecShapeForSchemaShape<NestedSchemaShape<TShape[K]>>
		: ArrayCodecShape<
				CodecShapeForSchemaShape<ArrayItemSchemaShape<TShape[K]>>
			> | Codec<any, any, any> | NoOpCodec;
};

type OutputZodNode<
	TInputField extends z.ZodTypeAny,
	TShapeNode,
> = TShapeNode extends Codec<any, any, infer TSchema>
	? TSchema
	: TShapeNode extends NoOpCodec
		? TInputField
	: TShapeNode extends ArrayCodecShape<infer TItemShape>
			? z.ZodArray<
					z.ZodObject<
						OutputZodShapeForSchemaShape<
							ArrayItemSchemaShape<TInputField>,
							TItemShape
						>
					>
				>
		: TShapeNode extends Record<string, any>
			? z.ZodObject<
					OutputZodShapeForSchemaShape<
						NestedSchemaShape<TInputField>,
						TShapeNode
					>
				>
			: never;

type OutputZodShapeForSchemaShape<
	TShape extends z.ZodRawShape,
	S extends RuntimeCodecShape,
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

function isArrayCodecShape(v: unknown): v is ArrayCodecShape {
	return (
		typeof v === "object" &&
		v !== null &&
		"__arrayCodecShape" in v &&
		(v as ArrayCodecShape).__arrayCodecShape === true &&
		"itemShape" in v
	);
}

function unwrapOptionalNullableSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
	let current: z.ZodTypeAny = schema;
	while (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
		current = current.unwrap();
	}
	return current;
}

function getNestedObjectSchema(schema: z.ZodTypeAny): z.AnyZodObject {
	const current = unwrapOptionalNullableSchema(schema);

	if (!(current instanceof z.ZodObject)) {
		throw new Error("Codec shape does not match nested object schema.");
	}

	return current;
}

function getArrayItemObjectSchema(schema: z.ZodTypeAny): z.AnyZodObject {
	const current = unwrapOptionalNullableSchema(schema);

	if (!(current instanceof z.ZodArray)) {
		throw new Error("Codec shape expects an array schema.");
	}

	return getNestedObjectSchema(current.element);
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
		} else if (isArrayCodecShape(node)) {
			const itemObjectSchema = getArrayItemObjectSchema(schemaNode);
			result[key] = z.array(
				z.object(
					buildOutputZodShape(
						node.itemShape as RuntimeCodecShape,
						itemObjectSchema.shape,
					),
				),
			);
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
		} else if (isArrayCodecShape(node)) {
			const value = data[key];
			result[key] = Array.isArray(value)
				? value.map((item) =>
						convertFromInput(
							node.itemShape as RuntimeCodecShape,
							item as Record<string, unknown>,
						),
					)
				: value;
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
		} else if (isArrayCodecShape(node)) {
			const value = data[key];
			result[key] = Array.isArray(value)
				? value.map((item) =>
						convertFromOutput(
							node.itemShape as RuntimeCodecShape,
							item as Record<string, unknown>,
						),
					)
				: value;
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
	const S extends RuntimeCodecShape,
>(
	inputSchema: TInputSchema,
	shape: S & CodecShapeForSchemaShape<SchemaShapeOf<TInputSchema>>,
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
