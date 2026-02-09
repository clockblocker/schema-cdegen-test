import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import type { DefaultValues, FieldErrors, Resolver } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import type { YesNo } from "~/components/YesNoPicker";
import { YesNoPicker } from "~/components/YesNoPicker";
import { Button } from "~/components/ui/button";
import type { ArFormIn } from "~/components/generated-schemas/ar/ar-form";
import { type FormInFor, type FormOutFor, type Role, type ScoringKind, defaultValuesFor, schemaFor } from "~/generics";

function QuestionForm<SK extends ScoringKind, R extends Role>({
	scoringKind,
	role,
}: {
	scoringKind: SK;
	role: R;
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInFor<SK>, unknown, FormOutFor<SK, R>>({
		resolver: zodResolver(
			schemaFor[scoringKind as keyof typeof schemaFor][role],
		) as unknown as Resolver<FormInFor<SK>, unknown, FormOutFor<SK, R>>,
		defaultValues: defaultValuesFor[
			scoringKind as keyof typeof defaultValuesFor
		] as unknown as DefaultValues<FormInFor<SK>>,
	});

	const onSubmit = (data: FormOutFor<SK, R>) => {
		console.log(`${scoringKind}/${role} submitted:`, data);
	};

	// Cast needed: TS can't resolve FieldErrors for deferred conditional FormInFor<SK>
	const fieldErrors = errors as FieldErrors<ArFormIn>;

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
		>
			<h2 className="font-semibold text-lg">{role}</h2>

			<Controller
				name={"questions.q1" as unknown as "questions.q1" & Parameters<typeof control.register>[0]}
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 1"
						value={field.value as YesNo | undefined}
						onChange={field.onChange}
						error={fieldErrors.questions?.q1?.message}
					/>
				)}
			/>

			<Controller
				name={"questions.q2" as unknown as "questions.q2" & Parameters<typeof control.register>[0]}
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 2"
						value={field.value as YesNo | undefined}
						onChange={field.onChange}
						error={fieldErrors.questions?.q2?.message}
					/>
				)}
			/>

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	);
}

export default function Home() {
	return (
		<>
			<Head>
				<title>Zod + RHF Test</title>
				<meta content="Testing zod3 schemas with react-hook-form" name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>
			<main className="flex min-h-screen items-center justify-center gap-8 p-8">
				<QuestionForm scoringKind="AR" role="Sales" />
				<QuestionForm scoringKind="AR" role="Scorer" />
			</main>
		</>
	);
}
