import fs from "node:fs";
import path from "node:path";
import { buildZodForType } from "./schema-from-typescript-type";
import {
	getExportedSymbol,
	getFromInputOutputType,
	getSourceFileOrThrow,
	loadProgram,
} from "./typescript-program";

export type CodecOutputSchemaConfig = {
	entry: string;
	codecExportName: string;
	out: string;
	schemaName?: string;
};

export type CodecOutputSchemaConfigRecord = Record<
	string,
	CodecOutputSchemaConfig
>;

type GenerateCodecOutputSchemaResult = {
	outFilePath: string;
};

function formatOutput({
	schemaName,
	schemaExpr,
	inputFilePath,
	codecExportName,
	warnings,
}: {
	schemaName: string;
	schemaExpr: string;
	inputFilePath: string;
	codecExportName: string;
	warnings: string[];
}): string {
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

function generateCodecOutputSchemaWithProgram(
	config: CodecOutputSchemaConfig,
	cwd: string,
	program: ReturnType<typeof loadProgram>,
): GenerateCodecOutputSchemaResult {
	const entryPath = path.resolve(cwd, config.entry);
	const outputPath = path.resolve(cwd, config.out);
	const schemaName = config.schemaName || `${config.codecExportName}OutputSchema`;
	const checker = program.getTypeChecker();
	const sourceFile = getSourceFileOrThrow(program, entryPath);
	const codecSymbol = getExportedSymbol(
		sourceFile,
		checker,
		config.codecExportName,
	);
	const outputType = getFromInputOutputType(codecSymbol, checker);
	const warnings: string[] = [];
	const schemaExpr = buildZodForType(outputType, checker, new Set(), warnings);
	const fileText = formatOutput({
		schemaName,
		schemaExpr,
		inputFilePath: path.relative(cwd, entryPath),
		codecExportName: config.codecExportName,
		warnings: Array.from(new Set(warnings)),
	});

	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, fileText, "utf8");

	return {
		outFilePath: outputPath,
	};
}

export function generateCodecOutputSchemas(
	configs: readonly CodecOutputSchemaConfig[],
	cwd = process.cwd(),
): GenerateCodecOutputSchemaResult[] {
	const program = loadProgram(cwd);
	return configs.map((config) =>
		generateCodecOutputSchemaWithProgram(config, cwd, program),
	);
}

export function generateCodecOutputSchema(
	config: CodecOutputSchemaConfig,
	cwd = process.cwd(),
): GenerateCodecOutputSchemaResult {
	return generateCodecOutputSchemas([config], cwd)[0]!;
}
