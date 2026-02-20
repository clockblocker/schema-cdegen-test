import { z } from "zod";
import type { SchemaShapeOf } from "./strict-adapter-builder";

type OutputWithAddedField<
	TInputSchema extends z.AnyZodObject,
	TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
	TDropFields extends readonly (keyof z.infer<TInputSchema>)[],
> = Omit<z.infer<TInputSchema>, TDropFields[number]> &
	Record<TFieldName, z.output<TFieldSchema>>;

type AddFieldConfig<
	TInputSchema extends z.AnyZodObject,
	TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
	TDropFields extends readonly (keyof z.infer<TInputSchema>)[],
> = {
	fieldName: TFieldName;
	fieldSchema: TFieldSchema;
	dropFields?: TDropFields;
	construct: (input: z.infer<TInputSchema>) => z.output<TFieldSchema>;
	reconstruct: (
		fieldValue: z.output<TFieldSchema>,
		output: OutputWithAddedField<
			TInputSchema,
			TFieldName,
			TFieldSchema,
			TDropFields
		>,
	) => Partial<z.infer<TInputSchema>>;
};

export function buildAddFieldAdapterAndOutputSchema<
	TInputSchema extends z.AnyZodObject,
	const TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
	const TDropFields extends readonly (keyof z.infer<TInputSchema>)[] = [],
>(
	inputSchema: TInputSchema,
	config: AddFieldConfig<TInputSchema, TFieldName, TFieldSchema, TDropFields>,
) {
	const { fieldName, fieldSchema, dropFields, construct, reconstruct } = config;
	const dropFieldSet = new Set<string>((dropFields ?? []) as string[]);

	if (fieldName in inputSchema.shape) {
		throw new Error(
			`Cannot add field "${fieldName}" because it already exists in the input schema.`,
		);
	}

	const shapeWithoutDroppedEntries = Object.entries(inputSchema.shape).filter(
		([key]) => !dropFieldSet.has(key),
	);
	const shapeWithoutDropped = Object.fromEntries(
		shapeWithoutDroppedEntries,
	) as Omit<SchemaShapeOf<TInputSchema>, TDropFields[number]>;

	const outputSchema = z.object({
		...shapeWithoutDropped,
		[fieldName]: fieldSchema,
	} as Omit<SchemaShapeOf<TInputSchema>, TDropFields[number]> &
		Record<TFieldName, TFieldSchema>) as z.ZodObject<
		Omit<SchemaShapeOf<TInputSchema>, TDropFields[number]> &
			Record<TFieldName, TFieldSchema>
	>;

	type InputType = z.infer<TInputSchema>;
	type OutputType = z.infer<typeof outputSchema>;

	const fromInput = (data: InputType): OutputType => {
		const constructedField = construct(data);
		const result = {
			...data,
			[fieldName]: constructedField,
		} as Record<string, unknown>;

		for (const dropField of dropFieldSet) {
			delete result[dropField];
		}

		return result as OutputType;
	};

	const fromOutput = (data: OutputType): InputType => {
		const reconstructedFields = reconstruct(
			data[fieldName],
			data as OutputWithAddedField<
				TInputSchema,
				TFieldName,
				TFieldSchema,
				TDropFields
			>,
		);

		const result: Record<string, unknown> = {
			...(data as Record<string, unknown>),
			...(reconstructedFields as Record<string, unknown>),
		};
		delete result[fieldName];

		return result as InputType;
	};

	return {
		outputSchema,
		fromInput,
		fromOutput,
	};
}
