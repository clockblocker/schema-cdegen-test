/** biome-ignore-all lint/suspicious/noExplicitAny: library */
import { z } from "zod";
import {
	buildOutputZodArrayItemLoose,
	convertArrayItemFromInputLoose,
	convertArrayItemFromOutputLoose,
} from "./loose-adapter-builder";
import {
	type ArrayCodecShape,
	asRecord,
	type Codec,
	isArrayCodecShape,
	isCodec,
	isNoOpCodec,
	noOpCodec,
	type RuntimeCodecShape,
	tryGetArrayItemSchema,
	tryGetNestedObjectSchema,
	unwrapOptionalNullableSchema,
} from "./strict-adapter-builder";

interface FromPathCodecShape<
	TNode extends RuntimeEvenLooserBaseNode = RuntimeEvenLooserBaseNode,
> {
	readonly __fromPathCodecShape: true;
	readonly path: string;
	readonly node: TNode;
}

interface FromPathsCodecShape<
	TCodec extends Codec<any, any, any> = Codec<any, any, any>,
> {
	readonly __fromPathsCodecShape: true;
	readonly paths: readonly string[];
	readonly codec: TCodec;
}

type RuntimeEvenLooserBaseNode =
	| RuntimeCodecShape
	| Codec<any, any, any>
	| typeof noOpCodec
	| ArrayCodecShape;

type RuntimeEvenLooserShapeNode =
	| RuntimeEvenLooserBaseNode
	| FromPathCodecShape
	| FromPathsCodecShape;

type RuntimeEvenLooserShape = Record<string, RuntimeEvenLooserShapeNode>;

export function fromPath<
	const TNode extends RuntimeEvenLooserBaseNode = typeof noOpCodec,
>(path: string, node?: TNode): FromPathCodecShape<TNode> {
	return {
		__fromPathCodecShape: true,
		path,
		node: (node ?? noOpCodec) as TNode,
	};
}

export function fromPaths<const TCodec extends Codec<any, any, any>>(
	paths: readonly string[],
	codec: TCodec,
): FromPathsCodecShape<TCodec> {
	return {
		__fromPathsCodecShape: true,
		paths,
		codec,
	};
}
function isFromPathCodecShape(v: unknown): v is FromPathCodecShape {
	return (
		typeof v === "object" &&
		v !== null &&
		"__fromPathCodecShape" in v &&
		(v as FromPathCodecShape).__fromPathCodecShape === true &&
		"path" in v &&
		"node" in v
	);
}

function isFromPathsCodecShape(v: unknown): v is FromPathsCodecShape {
	return (
		typeof v === "object" &&
		v !== null &&
		"__fromPathsCodecShape" in v &&
		(v as FromPathsCodecShape).__fromPathsCodecShape === true &&
		"paths" in v &&
		"codec" in v
	);
}

function pathTokens(path: string): string[] {
	return path.match(/[^.[\]]+/g) ?? [];
}

function isNumericPathToken(token: string): boolean {
	return /^\d+$/.test(token);
}

function getValueAtPath(data: unknown, path: string): unknown {
	let current: unknown = data;
	for (const token of pathTokens(path)) {
		if (current === null || current === undefined) {
			return undefined;
		}

		if (Array.isArray(current)) {
			const index = Number(token);
			current = Number.isInteger(index) ? current[index] : undefined;
			continue;
		}

		if (typeof current !== "object") {
			return undefined;
		}

		current = (current as Record<string, unknown>)[token];
	}

	return current;
}

function setValueAtPath(
	data: Record<string, unknown>,
	path: string,
	value: unknown,
): void {
	const tokens = pathTokens(path);
	if (tokens.length === 0) {
		return;
	}

	let current: unknown = data;
	for (let index = 0; index < tokens.length - 1; index++) {
		const token = tokens[index];
		const nextToken = tokens[index + 1];
		if (!token || !nextToken) {
			return;
		}
		const key: string | number = isNumericPathToken(token)
			? Number(token)
			: token;
		const nextContainerIsArray = isNumericPathToken(nextToken);

		if (!Array.isArray(current) && typeof current !== "object") {
			return;
		}

		const parent = current as Record<string | number, unknown>;
		const existing = parent[key];
		if (
			existing === null ||
			existing === undefined ||
			typeof existing !== "object"
		) {
			parent[key] = nextContainerIsArray ? [] : {};
		}
		current = parent[key];
	}

	const lastToken = tokens[tokens.length - 1];
	if (!lastToken) {
		return;
	}
	const lastKey: string | number = isNumericPathToken(lastToken)
		? Number(lastToken)
		: lastToken;

	if (!Array.isArray(current) && typeof current !== "object") {
		return;
	}

	(current as Record<string | number, unknown>)[lastKey] = value;
}

function getSchemaAtPath(
	schema: z.ZodTypeAny,
	path: string,
): z.ZodTypeAny | undefined {
	let current: z.ZodTypeAny | undefined = schema;
	for (const token of pathTokens(path)) {
		if (!current) {
			return undefined;
		}

		const unwrapped = unwrapOptionalNullableSchema(current);
		if (unwrapped instanceof z.ZodObject) {
			current = unwrapped.shape[token];
			continue;
		}

		if (unwrapped instanceof z.ZodArray) {
			if (!isNumericPathToken(token)) {
				return undefined;
			}
			current = unwrapped.element;
			continue;
		}

		return undefined;
	}

	return current;
}
function buildOutputZodNodeEvenLooserBase(
	node: RuntimeEvenLooserBaseNode,
	schemaNode: z.ZodTypeAny | undefined,
	inputSchema: z.AnyZodObject,
	includeUnspecifiedInputKeys?: boolean,
): z.ZodTypeAny {
	if (isCodec(node)) {
		return node.outputSchema;
	}

	if (isNoOpCodec(node)) {
		return schemaNode ?? z.unknown();
	}

	if (isArrayCodecShape(node)) {
		const itemSchema = tryGetArrayItemSchema(schemaNode);
		return z.array(buildOutputZodArrayItemLoose(node.itemShape, itemSchema));
	}

	const nestedObjectSchema = tryGetNestedObjectSchema(schemaNode);
	return z.object(
		buildOutputZodShapeEvenLooser(
			node as RuntimeEvenLooserShape,
			inputSchema,
			nestedObjectSchema?.shape,
			includeUnspecifiedInputKeys,
		),
	);
}

function buildOutputZodShapeEvenLooser(
	shape: RuntimeEvenLooserShape,
	inputSchema: z.AnyZodObject,
	schemaShape?: z.ZodRawShape,
	includeUnspecifiedInputKeys?: boolean,
): Record<string, z.ZodTypeAny> {
	const result: Record<string, z.ZodTypeAny> = {};

	for (const key in shape) {
		const node = shape[key];
		if (!node) {
			continue;
		}
		const schemaNode = schemaShape?.[key];
		if (isFromPathCodecShape(node)) {
			const sourceSchema = getSchemaAtPath(inputSchema, node.path);
			result[key] = buildOutputZodNodeEvenLooserBase(
				node.node,
				sourceSchema,
				inputSchema,
				includeUnspecifiedInputKeys,
			);
			continue;
		}

		if (isFromPathsCodecShape(node)) {
			result[key] = node.codec.outputSchema;
			continue;
		}

		result[key] = buildOutputZodNodeEvenLooserBase(
			node,
			schemaNode,
			inputSchema,
			includeUnspecifiedInputKeys,
		);
	}

	if (includeUnspecifiedInputKeys && schemaShape) {
		for (const key in schemaShape) {
			if (key in shape) {
				continue;
			}

			const schemaNode = schemaShape[key];
			if (schemaNode) {
				result[key] = schemaNode;
			}
		}
	}

	return result;
}

function convertNodeFromInputEvenLooserBase(
	node: RuntimeEvenLooserBaseNode,
	value: unknown,
	options: { includeUnspecifiedInputKeys?: boolean },
	rootInput: Record<string, unknown>,
): unknown {
	if (isCodec(node)) {
		return node.fromInput(value);
	}

	if (isNoOpCodec(node)) {
		return value;
	}

	if (isArrayCodecShape(node)) {
		return Array.isArray(value)
			? value.map((item) =>
					convertArrayItemFromInputLoose(node.itemShape, item),
				)
			: value;
	}

	return convertFromInputEvenLooser(
		node as RuntimeEvenLooserShape,
		asRecord(value),
		options,
		rootInput,
	);
}

function convertNodeFromOutputEvenLooserBase(
	node: RuntimeEvenLooserBaseNode,
	value: unknown,
	options: { includeUnspecifiedInputKeys?: boolean },
	rootResult: Record<string, unknown>,
): unknown {
	if (isCodec(node)) {
		return node.fromOutput(value);
	}

	if (isNoOpCodec(node)) {
		return value;
	}

	if (isArrayCodecShape(node)) {
		return Array.isArray(value)
			? value.map((item) =>
					convertArrayItemFromOutputLoose(node.itemShape, item),
				)
			: value;
	}

	return convertFromOutputEvenLooser(
		node as RuntimeEvenLooserShape,
		asRecord(value),
		options,
		rootResult,
	);
}

function convertFromInputEvenLooser(
	shape: RuntimeEvenLooserShape,
	data: Record<string, unknown>,
	options: { includeUnspecifiedInputKeys?: boolean },
	rootInput: Record<string, unknown> = data,
): Record<string, unknown> {
	const result: Record<string, unknown> = options.includeUnspecifiedInputKeys
		? { ...data }
		: {};

	for (const key in shape) {
		const node = shape[key];
		if (!node) {
			continue;
		}
		if (isFromPathCodecShape(node)) {
			const sourceValue = getValueAtPath(rootInput, node.path);
			result[key] = convertNodeFromInputEvenLooserBase(
				node.node,
				sourceValue,
				options,
				rootInput,
			);
			continue;
		}

		if (isFromPathsCodecShape(node)) {
			const sourceValues = node.paths.map((path) =>
				getValueAtPath(rootInput, path),
			);
			result[key] = node.codec.fromInput(sourceValues);
			continue;
		}

		result[key] = convertNodeFromInputEvenLooserBase(
			node,
			data[key],
			options,
			rootInput,
		);
	}

	return result;
}

function convertFromOutputEvenLooser(
	shape: RuntimeEvenLooserShape,
	data: Record<string, unknown>,
	options: { includeUnspecifiedInputKeys?: boolean },
	rootResult?: Record<string, unknown>,
): Record<string, unknown> {
	const result: Record<string, unknown> = options.includeUnspecifiedInputKeys
		? { ...data }
		: {};
	const rootTarget = rootResult ?? result;

	for (const key in shape) {
		const node = shape[key];
		if (!node) {
			continue;
		}
		delete result[key];

		if (isFromPathCodecShape(node)) {
			const sourceValue = convertNodeFromOutputEvenLooserBase(
				node.node,
				data[key],
				options,
				rootTarget,
			);
			setValueAtPath(rootTarget, node.path, sourceValue);
			continue;
		}

		if (isFromPathsCodecShape(node)) {
			const sourceValues = node.codec.fromOutput(data[key]);
			if (
				!Array.isArray(sourceValues) ||
				sourceValues.length !== node.paths.length
			) {
				throw new Error(
					`fromPaths mapping for "${key}" must decode to an array with ${node.paths.length} item(s).`,
				);
			}

			node.paths.forEach((path, index) => {
				setValueAtPath(rootTarget, path, sourceValues[index]);
			});
			continue;
		}

		result[key] = convertNodeFromOutputEvenLooserBase(
			node,
			data[key],
			options,
			rootTarget,
		);
		if (
			!options.includeUnspecifiedInputKeys &&
			typeof result[key] === "object" &&
			result[key] !== null &&
			!Array.isArray(result[key]) &&
			!isShapeWithLocalFromOutputFields(node as RuntimeEvenLooserShape)
		) {
			delete result[key];
		}
	}

	return result;
}

function isShapeWithLocalFromOutputFields(
	shape: RuntimeEvenLooserShape,
): boolean {
	for (const key in shape) {
		const node = shape[key];
		if (!node) {
			continue;
		}

		if (isFromPathCodecShape(node) || isFromPathsCodecShape(node)) {
			continue;
		}

		if (isCodec(node) || isNoOpCodec(node) || isArrayCodecShape(node)) {
			return true;
		}

		if (isShapeWithLocalFromOutputFields(node as RuntimeEvenLooserShape)) {
			return true;
		}
	}

	return false;
}
export function buildEvenLooserAddaptersAndOutputSchema<
	TInputSchema extends z.AnyZodObject,
	const S extends RuntimeEvenLooserShape,
>(
	inputSchema: TInputSchema,
	shape: S,
	options?: {
		includeUnspecifiedInputKeys?: boolean;
	},
) {
	const includeUnspecifiedInputKeys =
		options?.includeUnspecifiedInputKeys ?? false;
	const outputSchema = z.object(
		buildOutputZodShapeEvenLooser(
			shape as RuntimeEvenLooserShape,
			inputSchema,
			inputSchema.shape as z.ZodRawShape,
			includeUnspecifiedInputKeys,
		),
	);

	type InputType = z.infer<TInputSchema>;
	type OutputType = z.infer<typeof outputSchema>;

	const fromInput = (data: InputType): OutputType => {
		return convertFromInputEvenLooser(
			shape as RuntimeEvenLooserShape,
			data as Record<string, unknown>,
			{ includeUnspecifiedInputKeys },
		) as OutputType;
	};

	const fromOutput = (data: OutputType): InputType => {
		return convertFromOutputEvenLooser(
			shape as RuntimeEvenLooserShape,
			data as Record<string, unknown>,
			{ includeUnspecifiedInputKeys },
		) as InputType;
	};

	return {
		outputSchema,
		fromInput,
		fromOutput,
	};
}
