#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

function parseArgs(argv) {
	const args = {};
	for (let i = 0; i < argv.length; i += 1) {
		const token = argv[i];
		if (!token?.startsWith("--")) {
			continue;
		}
		const key = token.slice(2);
		const value = argv[i + 1];
		if (!value || value.startsWith("--")) {
			throw new Error(`Missing value for --${key}`);
		}
		args[key] = value;
		i += 1;
	}

	return args;
}

function assertRequiredArgs(args) {
	const required = ["entry", "export", "out"];
	for (const key of required) {
		if (!args[key]) {
			throw new Error(
				`Missing --${key}. Usage: node scripts/generate-codec-output-schema.mjs --entry <file.ts> --export <codecExportName> --out <output.ts> [--schema <schemaConstName>]`,
			);
		}
	}
}

function loadProgram(cwd) {
	const configPath = ts.findConfigFile(cwd, ts.sys.fileExists, "tsconfig.json");
	if (!configPath) {
		throw new Error("Could not find tsconfig.json");
	}

	const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
	if (configFile.error) {
		throw new Error(
			ts.formatDiagnosticsWithColorAndContext([configFile.error], {
				getCurrentDirectory: () => cwd,
				getCanonicalFileName: (fileName) => fileName,
				getNewLine: () => "\n",
			}),
		);
	}

	const parsed = ts.parseJsonConfigFileContent(
		configFile.config,
		ts.sys,
		path.dirname(configPath),
	);
	return ts.createProgram({
		rootNames: parsed.fileNames,
		options: parsed.options,
	});
}

function getExportedSymbol(sourceFile, checker, exportName) {
	const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
	if (!moduleSymbol) {
		throw new Error(`Could not resolve module symbol for ${sourceFile.fileName}`);
	}

	const exported = checker.getExportsOfModule(moduleSymbol);
	const match = exported.find((symbol) => symbol.name === exportName);
	if (!match) {
		throw new Error(`Export "${exportName}" was not found in ${sourceFile.fileName}`);
	}

	if (match.flags & ts.SymbolFlags.Alias) {
		return checker.getAliasedSymbol(match);
	}

	return match;
}

function getFromInputOutputType(codecSymbol, checker) {
	const declarations = codecSymbol.declarations;
	if (!declarations || declarations.length === 0) {
		throw new Error(`Export "${codecSymbol.name}" has no declarations`);
	}

	const location = declarations[0];
	const codecType = checker.getTypeOfSymbolAtLocation(codecSymbol, location);
	const fromInputSymbol = codecType.getProperty("fromInput");
	if (!fromInputSymbol) {
		throw new Error(`Export "${codecSymbol.name}" does not have "fromInput"`);
	}

	const fromInputType = checker.getTypeOfSymbolAtLocation(fromInputSymbol, location);
	const signatures = checker.getSignaturesOfType(fromInputType, ts.SignatureKind.Call);
	if (signatures.length === 0) {
		throw new Error(`"fromInput" in "${codecSymbol.name}" is not callable`);
	}

	return checker.getReturnTypeOfSignature(signatures[0]);
}

function removeUnionMembers(type, checker, predicate) {
	if (!type.isUnion()) {
		return { type, removed: false };
	}

	const kept = [];
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
		return { type: kept[0], removed: true };
	}

	return { type: checker.getUnionType(kept, ts.UnionReduction.None), removed: true };
}

function isUndefinedType(type) {
	return (type.flags & ts.TypeFlags.Undefined) !== 0;
}

function isNullType(type) {
	return (type.flags & ts.TypeFlags.Null) !== 0;
}

function isDateType(type, checker) {
	return checker.typeToString(type) === "Date";
}

function isStringLiteralType(type) {
	return (type.flags & ts.TypeFlags.StringLiteral) !== 0;
}

function isNumberLiteralType(type) {
	return (type.flags & ts.TypeFlags.NumberLiteral) !== 0;
}

function isBooleanLiteralType(type) {
	return (type.flags & ts.TypeFlags.BooleanLiteral) !== 0;
}

function buildZodForType(type, checker, seen, warnings) {
	if (seen.has(type.id)) {
		warnings.push("Recursive type detected; using z.unknown() at recursion point.");
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
		let intersectionExpr = nodes[0];
		for (let i = 1; i < nodes.length; i += 1) {
			intersectionExpr = `z.intersection(${intersectionExpr}, ${nodes[i]})`;
		}
		return intersectionExpr;
	}

	if (checker.isTupleType(type)) {
		const tupleRef = type;
		const items = checker
			.getTypeArguments(tupleRef)
			.map((item) => buildZodForType(item, checker, seen, warnings));
		return `z.tuple([${items.join(", ")}])`;
	}

	if (checker.isArrayType(type)) {
		const arrayRef = type;
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

		seen.add(type.id);
		const objectExpr = buildObjectZod(type, checker, seen, warnings);
		seen.delete(type.id);
		return objectExpr;
	}

	warnings.push(
		`Unsupported type "${checker.typeToString(type)}"; using z.unknown().`,
	);
	return "z.unknown()";
}

function buildPrimitiveZod(type, checker) {
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
		return `z.literal(${type.intrinsicName === "true" ? "true" : "false"})`;
	}

	if (isDateType(type, checker)) {
		return "z.date()";
	}

	return null;
}

function buildUnionZod(unionType, checker, seen, warnings) {
	const nonUndefined = removeUnionMembers(unionType, checker, (member) =>
		isUndefinedType(member),
	);
	const nonNullable = removeUnionMembers(nonUndefined.type, checker, (member) =>
		isNullType(member),
	);

	const hasUndefined = nonUndefined.removed;
	const hasNull = nonNullable.removed;
	let expr;

	const coreType = nonNullable.type;
	if (coreType.isUnion()) {
		const members = coreType.types;
		const stringLiteralOnly = members.every((member) => isStringLiteralType(member));
		if (stringLiteralOnly) {
			const options = members.map((member) => JSON.stringify(member.value)).join(", ");
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

function buildObjectZod(objectType, checker, seen, warnings) {
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

	const fragments = [];
	for (const prop of props) {
		const declaration = prop.valueDeclaration ?? prop.declarations?.[0];
		if (!declaration) {
			warnings.push(`Property "${prop.name}" has no declaration; using z.unknown().`);
			fragments.push(`${JSON.stringify(prop.name)}: z.unknown()`);
			continue;
		}

		let propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
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

function formatOutput({
	schemaName,
	schemaExpr,
	inputFilePath,
	codecExportName,
	warnings,
}) {
	const warningBlock =
		warnings.length === 0
			? ""
			: `\n/*\nCodegen warnings:\n${warnings
					.map((warning) => `- ${warning}`)
					.join("\n")}\n*/\n`;

	return `// AUTO-GENERATED FILE. DO NOT EDIT.
// Source: ${inputFilePath}
// Codec export: ${codecExportName}
import { z } from "zod";${warningBlock}
export const ${schemaName} = ${schemaExpr};

export type ${schemaName}Type = z.infer<typeof ${schemaName}>;
`;
}

function main() {
	const cwd = process.cwd();
	const args = parseArgs(process.argv.slice(2));
	assertRequiredArgs(args);

	const entryPath = path.resolve(cwd, args.entry);
	const outputPath = path.resolve(cwd, args.out);
	const schemaName = args.schema || `${args.export}OutputSchema`;

	const program = loadProgram(cwd);
	const checker = program.getTypeChecker();
	const sourceFile = program.getSourceFile(entryPath);
	if (!sourceFile) {
		throw new Error(`Entry file is not part of tsconfig program: ${entryPath}`);
	}

	const codecSymbol = getExportedSymbol(sourceFile, checker, args.export);
	const outputType = getFromInputOutputType(codecSymbol, checker);
	const warnings = [];
	const schemaExpr = buildZodForType(outputType, checker, new Set(), warnings);
	const fileText = formatOutput({
		schemaName,
		schemaExpr,
		inputFilePath: path.relative(cwd, entryPath),
		codecExportName: args.export,
		warnings: Array.from(new Set(warnings)),
	});

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, fileText, "utf8");
	process.stdout.write(`Generated ${path.relative(cwd, outputPath)}\n`);
}

main();
