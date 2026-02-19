import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { QuestionGroup } from "./question-group";
import type { AudutFormValues, AudutQuestionGroup } from "./types";

function TotalWeight({ groups }: { groups: AudutQuestionGroup[] }) {
	const allGroupValues = useWatch<AudutFormValues, "groups">({
		name: "groups",
	});

	let total = 0;
	let hasAny = false;

	for (const group of groups) {
		const gid = String(group.groupId);
		const values = allGroupValues?.[gid];
		if (!values) continue;

		const allAnswered = group.questionIds.every(
			(qId) => values[qId] !== undefined,
		);
		if (!allAnswered) continue;

		let sum = 0;
		let currentAnswers = group.answersTree;
		let valid = true;

		for (const qId of group.questionIds) {
			const selectedId = values[qId];
			const selected = currentAnswers.find((a) => a.id === selectedId);
			if (!selected) {
				valid = false;
				break;
			}
			sum += selected.weight ?? 0;
			currentAnswers = selected.relatedAnswers;
		}

		if (valid) {
			total += sum * (group.groupWeight ?? 1);
			hasAny = true;
		}
	}

	if (!hasAny) return null;

	return (
		<div className="rounded-lg border border-dashed p-4 text-center font-semibold text-lg">
			Total Weight: {total}
		</div>
	);
}

export function AudutForm({ groups }: { groups: AudutQuestionGroup[] }) {
	const schema = useMemo(() => {
		const groupSchemas: Record<string, z.ZodTypeAny> = {};
		for (const g of groups) {
			const qSchemas: Record<string, z.ZodTypeAny> = {};
			for (const qId of g.questionIds) {
				qSchemas[qId] = z.string().optional();
				qSchemas[`${qId}_comment`] = z.string().optional();
			}
			groupSchemas[String(g.groupId)] = z.object(qSchemas);
		}
		return z.object({ groups: z.object(groupSchemas) });
	}, [groups]);

	const defaultValues = useMemo(() => {
		const groupDefaults: Record<string, Record<string, undefined>> = {};
		for (const g of groups) {
			const qDefaults: Record<string, undefined> = {};
			for (const qId of g.questionIds) {
				qDefaults[qId] = undefined;
				qDefaults[`${qId}_comment`] = undefined;
			}
			groupDefaults[String(g.groupId)] = qDefaults;
		}
		return { groups: groupDefaults };
	}, [groups]);

	const methods = useForm<AudutFormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const onSubmit = (data: AudutFormValues) => {
		console.log("Audut form submitted:", data);
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex w-full max-w-lg flex-col gap-6"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				{groups.map((g) => (
					<QuestionGroup group={g} key={g.groupId} />
				))}
				<TotalWeight groups={groups} />
				<Button type="submit" variant="outline">
					Submit
				</Button>
			</form>
		</FormProvider>
	);
}
