import path from "node:path";
import ts from "typescript";

export function loadProgram(cwd: string): ts.Program {
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

export function getSourceFileOrThrow(
	program: ts.Program,
	entryPath: string,
): ts.SourceFile {
	const sourceFile = program.getSourceFile(entryPath);
	if (!sourceFile) {
		throw new Error(`Entry file is not part of tsconfig program: ${entryPath}`);
	}

	return sourceFile;
}

export function getExportedSymbol(
	sourceFile: ts.SourceFile,
	checker: ts.TypeChecker,
	exportName: string,
): ts.Symbol {
	const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
	if (!moduleSymbol) {
		throw new Error(
			`Could not resolve module symbol for ${sourceFile.fileName}`,
		);
	}

	const exported = checker.getExportsOfModule(moduleSymbol);
	const match = exported.find((symbol) => symbol.name === exportName);
	if (!match) {
		throw new Error(
			`Export "${exportName}" was not found in ${sourceFile.fileName}`,
		);
	}

	if (match.flags & ts.SymbolFlags.Alias) {
		return checker.getAliasedSymbol(match);
	}

	return match;
}

export function getFromInputOutputType(
	codecSymbol: ts.Symbol,
	checker: ts.TypeChecker,
): ts.Type {
	const declarations = codecSymbol.declarations;
	if (!declarations || declarations.length === 0) {
		throw new Error(`Export "${codecSymbol.name}" has no declarations`);
	}

	const location = declarations[0];
	if (!location) {
		throw new Error(`Export "${codecSymbol.name}" has no declarations`);
	}
	const codecType = checker.getTypeOfSymbolAtLocation(codecSymbol, location);
	const fromInputSymbol = codecType.getProperty("fromInput");
	if (!fromInputSymbol) {
		throw new Error(`Export "${codecSymbol.name}" does not have "fromInput"`);
	}

	const fromInputType = checker.getTypeOfSymbolAtLocation(
		fromInputSymbol,
		location,
	);
	const signatures = checker.getSignaturesOfType(
		fromInputType,
		ts.SignatureKind.Call,
	);
	if (signatures.length === 0) {
		throw new Error(`"fromInput" in "${codecSymbol.name}" is not callable`);
	}

	const firstSignature = signatures[0];
	if (!firstSignature) {
		throw new Error(`"fromInput" in "${codecSymbol.name}" is not callable`);
	}

	return checker.getReturnTypeOfSignature(firstSignature);
}
