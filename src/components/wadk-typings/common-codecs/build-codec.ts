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

type CodecNode = Codec<any, any, any> | Record<string, any>;
type CodecShape = Record<string, CodecNode>;

type FormZodShape<S extends CodecShape> = {
	[K in keyof S]: S[K] extends Codec<any, any, infer TSchema>
		? TSchema
		: S[K] extends CodecShape
			? z.ZodObject<FormZodShape<S[K]>>
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

function buildFormZodShape(shape: CodecShape): Record<string, z.ZodTypeAny> {
	const result: Record<string, z.ZodTypeAny> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.schema;
		} else {
			result[key] = z.object(buildFormZodShape(node as CodecShape));
		}
	}
	return result;
}

function convertToForm(
	shape: CodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.toForm(data[key]);
		} else {
			result[key] = convertToForm(
				node as CodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}
	return result;
}

function convertToServer(
	shape: CodecShape,
	data: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	for (const key in shape) {
		const node = shape[key];
		if (isCodec(node)) {
			result[key] = node.toServer(data[key]);
		} else {
			result[key] = convertToServer(
				node as CodecShape,
				data[key] as Record<string, unknown>,
			);
		}
	}

	return result;
}

export function buildCodec<S extends CodecShape>(
	serverSchema: z.AnyZodObject,
	shape: S,
) {
	const formSchema = z.object(buildFormZodShape(shape)) as z.ZodObject<
		FormZodShape<S>
	>;

	type ServerType = z.infer<typeof serverSchema>;
	type FormType = z.infer<typeof formSchema>;

	const toForm = (data: ServerType): FormType => {
		return convertToForm(shape, data as Record<string, unknown>) as FormType;
	};

	const toServer = (data: FormType): ServerType => {
		return convertToServer(
			shape,
			data as Record<string, unknown>,
		) as ServerType;
	};

	const codec = serverSchema.transform(toForm).pipe(formSchema);

	return { formSchema, toForm, toServer, codec };
}
