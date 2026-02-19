import ts from "typescript";

function removeUnionMembers(
	type: ts.Type,
	checker: ts.TypeChecker,
	predicate: (member: ts.Type, checker: ts.TypeChecker) => boolean,
): { type: ts.Type; removed: boolean } {
	if (!type.isUnion()) {
		return { type, removed: false };
	}

	const kept: ts.Type[] = [];
	let removed = false;
	for (const member of type.types) {
		if (predicate(member, checker)) {
			removed = true;
			continue;
		}
		kept.push(member);
	}

	if (!removed) {
		return { type, removed: false };
	}

	if (kept.length === 0) {
		return { type: checker.getNeverType(), removed: true };
	}

	if (kept.length === 1) {
		const firstKept = kept[0];
		if (!firstKept) {
			return { type: checker.getNeverType(), removed: true };
		}

		return { type: firstKept, removed: true };
	}

	const checkerWithUnion = checker as ts.TypeChecker & {
		getUnionType?: (types: ts.Type[], unionReduction: number) => ts.Type;
	};
	if (!checkerWithUnion.getUnionType) {
		return { type, removed: false };
	}

	return {
		type: checkerWithUnion.getUnionType(kept, 0),
		removed: true,
	};
}

function isUndefinedType(type: ts.Type): boolean {
	return (type.flags & ts.TypeFlags.Undefined) !== 0;
}

function isNullType(type: ts.Type): boolean {
	return (type.flags & ts.TypeFlags.Null) !== 0;
}

function isDateType(type: ts.Type, checker: ts.TypeChecker): boolean {
	return checker.typeToString(type) === "Date";
}

function isStringLiteralType(type: ts.Type): type is ts.StringLiteralType {
	return (type.flags & ts.TypeFlags.StringLiteral) !== 0;
}

function isNumberLiteralType(type: ts.Type): type is ts.NumberLiteralType {
	return (type.flags & ts.TypeFlags.NumberLiteral) !== 0;
}

function isBooleanLiteralType(type: ts.Type): boolean {
	return (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
}

function buildPrimitiveZod(type: ts.Type, checker: ts.TypeChecker): string | null {
	if ((type.flags & ts.TypeFlags.Any) !== 0) {
		return "z.any()";
	}
	if ((type.flags & ts.TypeFlags.Unknown) !== 0) {
		return "z.unknown()";
	}
	if ((type.flags & ts.TypeFlags.Never) !== 0) {
		return "z.never()";
	}
	if ((type.flags & ts.TypeFlags.String) !== 0) {
		return "z.string()";
	}
	if ((type.flags & ts.TypeFlags.Number) !== 0) {
		return "z.number()";
	}
	if ((type.flags & ts.TypeFlags.Boolean) !== 0) {
		return "z.boolean()";
	}
	if ((type.flags & ts.TypeFlags.BigInt) !== 0) {
		return "z.bigint()";
	}
	if ((type.flags & ts.TypeFlags.Null) !== 0) {
		return "z.null()";
	}
	if ((type.flags & ts.TypeFlags.Undefined) !== 0) {
		return "z.undefined()";
	}
	if ((type.flags & ts.TypeFlags.Void) !== 0) {
		return "z.void()";
	}

	if (isStringLiteralType(type)) {
		return `z.literal(${JSON.stringify(type.value)})`;
	}
	if (isNumberLiteralType(type)) {
		return `z.literal(${String(type.value)})`;
	}
	if (isBooleanLiteralType(type)) {
		return `z.literal(${checker.typeToString(type) === "true" ? "true" : "false"})`;
	}

	if (isDateType(type, checker)) {
		return "z.date()";
	}

	return null;
}

function buildUnionZod(
	unionType: ts.UnionType,
	checker: ts.TypeChecker,
	seen: Set<ts.Type>,
	warnings: string[],
): string {
	const nonUndefined = removeUnionMembers(unionType, checker, (member) =>
		isUndefinedType(member),
	);
	const nonNullable = removeUnionMembers(nonUndefined.type, checker, (member) =>
		isNullType(member),
	);

	const hasUndefined = nonUndefined.removed;
	const hasNull = nonNullable.removed;
	let expr: string;

	const coreType = nonNullable.type;
	if (coreType.isUnion()) {
		const members = coreType.types;
		const stringLiteralOnly = members.every((member) =>
			isStringLiteralType(member),
		);
		if (stringLiteralOnly) {
			const options = members
				.map((member) =>
					JSON.stringify((member as ts.StringLiteralType).value),
				)
				.join(", ");
			expr = `z.enum([${options}])`;
		} else {
			const schemas = members.map((member) =>
				buildZodForType(member, checker, seen, warnings),
			);
			expr = `z.union([${schemas.join(", ")}])`;
		}
	} else {
		expr = buildZodForType(coreType, checker, seen, warnings);
	}

	if (hasNull) {
		expr = `${expr}.nullable()`;
	}
	if (hasUndefined) {
		expr = `${expr}.optional()`;
	}

	return expr;
}

function buildObjectZod(
	objectType: ts.Type,
	checker: ts.TypeChecker,
	seen: Set<ts.Type>,
	warnings: string[],
): string {
	const props = checker
		.getPropertiesOfType(objectType)
		.filter((symbol) => (symbol.getFlags() & ts.SymbolFlags.Method) === 0);

	if (props.length === 0) {
		const stringIndexType = checker.getIndexTypeOfType(
			objectType,
			ts.IndexKind.String,
		);
		if (stringIndexType) {
			return `z.record(${buildZodForType(stringIndexType, checker, seen, warnings)})`;
		}
		return "z.object({})";
	}

	const fragments: string[] = [];
	const objectDeclaration =
		objectType.symbol?.valueDeclaration ?? objectType.symbol?.declarations?.[0];
	for (const prop of props) {
		const declaration =
			prop.valueDeclaration ?? prop.declarations?.[0] ?? objectDeclaration;
		let propType = declaration
			? checker.getTypeOfSymbolAtLocation(prop, declaration)
			: checker.getDeclaredTypeOfSymbol(prop);
		const optionalByFlag = (prop.getFlags() & ts.SymbolFlags.Optional) !== 0;
		const withoutUndefined = removeUnionMembers(propType, checker, (member) =>
			isUndefinedType(member),
		);
		propType = withoutUndefined.type;
		const withoutNull = removeUnionMembers(propType, checker, (member) =>
			isNullType(member),
		);
		propType = withoutNull.type;

		let propExpr = buildZodForType(propType, checker, seen, warnings);
		if (withoutNull.removed) {
			propExpr = `${propExpr}.nullable()`;
		}
		if (optionalByFlag || withoutUndefined.removed) {
			propExpr = `${propExpr}.optional()`;
		}

		const key = /^[$A-Z_][0-9A-Z_$]*$/i.test(prop.name)
			? prop.name
			: JSON.stringify(prop.name);
		fragments.push(`${key}: ${propExpr}`);
	}

	return `z.object({ ${fragments.join(", ")} })`;
}

export function buildZodForType(
	type: ts.Type,
	checker: ts.TypeChecker,
	seen: Set<ts.Type>,
	warnings: string[],
): string {
	if (seen.has(type)) {
		warnings.push(
			"Recursive type detected; using z.unknown() at recursion point.",
		);
		return "z.unknown()";
	}

	const primitive = buildPrimitiveZod(type, checker);
	if (primitive) {
		return primitive;
	}

	if (type.isUnion()) {
		return buildUnionZod(type, checker, seen, warnings);
	}

	if (type.isIntersection()) {
		const nodes = type.types.map((member) =>
			buildZodForType(member, checker, seen, warnings),
		);
		if (nodes.length === 0) {
			return "z.never()";
		}
		const firstNode = nodes[0];
		if (!firstNode) {
			return "z.never()";
		}

		let intersectionExpr = firstNode;
		for (let i = 1; i < nodes.length; i += 1) {
			const currentNode = nodes[i];
			if (!currentNode) {
				continue;
			}
			intersectionExpr = `z.intersection(${intersectionExpr}, ${currentNode})`;
		}
		return intersectionExpr;
	}

	if (checker.isTupleType(type)) {
		const tupleRef = type as ts.TypeReference;
		const items = checker
			.getTypeArguments(tupleRef)
			.map((item) => buildZodForType(item, checker, seen, warnings));
		return `z.tuple([${items.join(", ")}])`;
	}

	if (checker.isArrayType(type)) {
		const arrayRef = type as ts.TypeReference;
		const args = checker.getTypeArguments(arrayRef);
		const itemType = args[0] ?? checker.getAnyType();
		return `z.array(${buildZodForType(itemType, checker, seen, warnings)})`;
	}

	if ((type.flags & ts.TypeFlags.Object) !== 0) {
		if (isDateType(type, checker)) {
			return "z.date()";
		}

		const callSignatures = checker.getSignaturesOfType(
			type,
			ts.SignatureKind.Call,
		);
		if (callSignatures.length > 0) {
			warnings.push(
				`Function-like type "${checker.typeToString(type)}" is unsupported; using z.unknown().`,
			);
			return "z.unknown()";
		}

		seen.add(type);
		const objectExpr = buildObjectZod(type, checker, seen, warnings);
		seen.delete(type);
		return objectExpr;
	}

	warnings.push(
		`Unsupported type "${checker.typeToString(type)}"; using z.unknown().`,
	);
	return "z.unknown()";
}
