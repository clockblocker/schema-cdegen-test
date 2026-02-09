import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import type { DefaultValues, Resolver } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { ArFormFields } from "~/components/forms/ar-form";
import { LoansFormFields } from "~/components/forms/loans-form";
import { Button } from "~/components/ui/button";
import {
	defaultValuesFor,
	type FormInFor,
	type FormOutFor,
	type Role,
	type ScoringKind,
	schemaFor,
} from "~/generics";

function QuestionForm<SK extends ScoringKind, R extends Role>({
	sk,
	role,
}: {
	sk: SK;
	role: R;
}) {
	const methods = useForm<FormInFor<SK>, unknown, FormOutFor<SK, R>>({
		resolver: zodResolver(schemaFor[sk][role]),
		defaultValues: defaultValuesFor[sk],
	});

	const onSubmit = (data: FormOutFor<SK, R>) => {
		console.log(`${sk}/${role} submitted:`, data);
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<h2 className="font-semibold text-lg">{role}</h2>
				{sk === "AR" && <ArFormFields />}
				{sk === "Loans" && <LoansFormFields />}
				<Button type="submit" variant="outline">
					Submit
				</Button>
			</form>
		</FormProvider>
	);
}

export default function Home() {
	return (
		<>
			<Head>
				<title>Zod + RHF Test</title>
				<meta
					content="Testing zod3 schemas with react-hook-form"
					name="description"
				/>
				<link href="/favicon.ico" rel="icon" />
			</Head>
			<main className="flex min-h-screen items-center justify-center gap-8 p-8">
				<QuestionForm role="Sales" sk="AR" />
				<QuestionForm role="Scorer" sk="AR" />
				<QuestionForm role="Sales" sk="Loans" />
				<QuestionForm role="Scorer" sk="Loans" />
			</main>
		</>
	);
}
