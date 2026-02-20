import { z } from "zod";
import type { SchemaShapeOf } from "./strict-adapter-builder";

type OutputWithAddedField<
	TInputSchema extends z.AnyZodObject,
	TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
> = z.infer<TInputSchema> & Record<TFieldName, z.output<TFieldSchema>>;

type AddFieldConfig<
	TInputSchema extends z.AnyZodObject,
	TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
> = {
	fieldName: TFieldName;
	fieldSchema: TFieldSchema;
	construct: (input: z.infer<TInputSchema>) => z.output<TFieldSchema>;
	reconstruct: (
		fieldValue: z.output<TFieldSchema>,
		output: OutputWithAddedField<TInputSchema, TFieldName, TFieldSchema>,
	) => Partial<z.infer<TInputSchema>>;
};

export function buildAddFieldAdapterAndOutputSchema<
	TInputSchema extends z.AnyZodObject,
	const TFieldName extends string,
	TFieldSchema extends z.ZodTypeAny,
>(
	inputSchema: TInputSchema,
	config: AddFieldConfig<TInputSchema, TFieldName, TFieldSchema>,
) {
	const { fieldName, fieldSchema, construct, reconstruct } = config;

	if (fieldName in inputSchema.shape) {
		throw new Error(
			`Cannot add field "${fieldName}" because it already exists in the input schema.`,
		);
	}

	const outputSchema = z.object({
		...inputSchema.shape,
		[fieldName]: fieldSchema,
	} as SchemaShapeOf<TInputSchema> &
		Record<TFieldName, TFieldSchema>) as z.ZodObject<
		SchemaShapeOf<TInputSchema> & Record<TFieldName, TFieldSchema>
	>;

	type InputType = z.infer<TInputSchema>;
	type OutputType = z.infer<typeof outputSchema>;

	const fromInput = (data: InputType): OutputType => {
		const constructedField = construct(data);
		return {
			...data,
			[fieldName]: constructedField,
		} as OutputType;
	};

	const fromOutput = (data: OutputType): InputType => {
		const reconstructedFields = reconstruct(
			data[fieldName],
			data as OutputWithAddedField<TInputSchema, TFieldName, TFieldSchema>,
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
