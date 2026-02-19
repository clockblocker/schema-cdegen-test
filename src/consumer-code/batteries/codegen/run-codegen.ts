import {
	type CodecOutputSchemaConfig,
	generateCodecOutputSchemas,
} from "./lib/generate-codec-output-schema";
import { codecOutputSchemaTasks } from "./codec-output-schema-tasks";

type TaskName = keyof typeof codecOutputSchemaTasks;

function isTaskName(taskName: string): taskName is TaskName {
	return taskName in codecOutputSchemaTasks;
}

function selectTasks(taskNames: string[]): CodecOutputSchemaConfig[] {
	if (taskNames.length === 0) {
		return Object.values(codecOutputSchemaTasks);
	}

	return taskNames.map((taskName) => {
		if (!isTaskName(taskName)) {
			throw new Error(
				`Unknown codegen task "${taskName}". Available tasks: ${Object.keys(codecOutputSchemaTasks).join(", ")}`,
			);
		}
		return codecOutputSchemaTasks[taskName];
	});
}

function main(): void {
	const taskNames = process.argv.slice(2);
	const tasks = selectTasks(taskNames);
	const results = generateCodecOutputSchemas(tasks);
	for (const result of results) {
		console.log(`Generated ${result.outFilePath}`);
	}
}

main();
