import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { FormProvider, useForm } from "react-hook-form";
import { AudutForm } from "~/components/forms/audut/audut-form";
import { mockAudutGroups } from "~/components/forms/audut/mock-data";
import { HospitalFormFields } from "~/components/forms/hospital-form";
import { SchoolFormFields } from "~/components/forms/school-form";
import { Button } from "~/components/ui/button";
import {
	type AudutKind,
	defaultValuesFor,
	type FormInFor,
	type FormOutFor,
	getSchema,
	type Role,
} from "~/generics";

function QuestionForm<SK extends AudutKind, R extends Role>({
	sk,
	audutRole,
}: {
	sk: SK;
	audutRole: R;
}) {
	const methods = useForm<FormInFor<SK>, unknown, FormOutFor<SK, R>>({
		resolver: zodResolver(getSchema(sk, audutRole)),
		defaultValues: defaultValuesFor[sk],
	});

	const onSubmit = (data: FormOutFor<SK, R>) => {
		console.log(`${sk}/${audutRole} submitted:`, data);
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<h2 className="font-semibold text-lg">{audutRole}</h2>
				{sk === "Hospital" && <HospitalFormFields />}
				{sk === "School" && <SchoolFormFields />}
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
			<main className="flex min-h-screen flex-col items-center gap-12 p-8">
				<div className="flex items-start justify-center gap-8">
					<QuestionForm audutRole="Sales" sk="Hospital" />
					<QuestionForm audutRole="Scorer" sk="Hospital" />
					<QuestionForm audutRole="Sales" sk="School" />
					<QuestionForm audutRole="Scorer" sk="School" />
				</div>
				<AudutForm groups={mockAudutGroups} />
			</main>
		</>
	);
}
