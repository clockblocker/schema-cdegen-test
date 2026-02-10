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

type CodecShape = Record<string, Record<string, Codec<any, any, any>>>;

type SchemaOf<R extends Record<string, Codec<any, any, any>>> = {
	[K in keyof R]: R[K]["schema"];
};

type FormZodShape<S extends CodecShape> = {
	[G in keyof S]: z.ZodObject<SchemaOf<S[G]>>;
};

export function buildCodec<S extends CodecShape>(
	serverSchema: z.AnyZodObject,
	shape: S,
) {
	const formZodShape = {} as Record<string, z.ZodObject<any>>;
	for (const group in shape) {
		const fields = shape[group]!;
		const fieldSchemas = {} as Record<string, z.ZodTypeAny>;
		for (const field in fields) {
			fieldSchemas[field] = fields[field]!.schema;
		}
		formZodShape[group] = z.object(fieldSchemas);
	}

	const formSchema = z.object(formZodShape) as z.ZodObject<FormZodShape<S>>;

	type ServerType = z.infer<typeof serverSchema>;
	type FormType = z.infer<typeof formSchema>;

	const toForm = (data: ServerType): FormType => {
		const result = {} as Record<string, Record<string, unknown>>;
		for (const group in shape) {
			const fields = shape[group]!;
			const serverGroup = (data as Record<string, Record<string, unknown>>)[
				group
			]!;
			const formGroup = {} as Record<string, unknown>;
			for (const field in fields) {
				formGroup[field] = fields[field]!.toForm(serverGroup[field]);
			}
			result[group] = formGroup;
		}
		return result as FormType;
	};

	const toServer = (data: FormType): ServerType => {
		const result = {} as Record<string, Record<string, unknown>>;
		for (const group in shape) {
			const fields = shape[group]!;
			const formGroup = (data as Record<string, Record<string, unknown>>)[
				group
			]!;
			const serverGroup = {} as Record<string, unknown>;
			for (const field in fields) {
				serverGroup[field] = fields[field]!.toServer(formGroup[field]);
			}
			result[group] = serverGroup;
		}
		return result as ServerType;
	};

	const codec = serverSchema.transform(toForm).pipe(formSchema);

	return { formSchema, toForm, toServer, codec };
}
