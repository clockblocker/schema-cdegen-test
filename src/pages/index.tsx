import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { FormProvider, useForm } from "react-hook-form";
import { ArFormFields } from "~/components/forms/ar-form";
import { LoansFormFields } from "~/components/forms/loans-form";
import { Button } from "~/components/ui/button";
import {
	defaultValuesFor,
	type FormInFor,
	type FormOutFor,
	getSchema,
	type Role,
	type ScoringKind,
} from "~/generics";

function QuestionForm<SK extends ScoringKind, R extends Role>({
	sk,
	scoringRole,
}: {
	sk: SK;
	scoringRole: R;
}) {
	const methods = useForm<FormInFor<SK>, unknown, FormOutFor<SK, R>>({
		resolver: zodResolver(getSchema(sk, scoringRole)),
		defaultValues: defaultValuesFor[sk],
	});

	const onSubmit = (data: FormOutFor<SK, R>) => {
		console.log(`${sk}/${scoringRole} submitted:`, data);
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<h2 className="font-semibold text-lg">{scoringRole}</h2>
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
				<QuestionForm scoringRole="Sales" sk="AR" />
				<QuestionForm scoringRole="Scorer" sk="AR" />
				<QuestionForm scoringRole="Sales" sk="Loans" />
				<QuestionForm scoringRole="Scorer" sk="Loans" />
			</main>
		</>
	);
}
