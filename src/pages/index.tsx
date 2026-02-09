import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { type Resolver, Controller, useForm } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import { Button } from "~/components/ui/button";
import type { FormIn } from "~/schemas";
import { type FormOutFor, type Role, defaultValues, schemaFor } from "~/generics";

function QuestionForm<R extends Role>({
	role,
}: {
	role: R;
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormIn, unknown, FormOutFor<R>>({
		resolver: zodResolver(schemaFor[role]) as Resolver<FormIn, unknown, FormOutFor<R>>,
		defaultValues,
	});

	const onSubmit = (data: FormOutFor<R>) => {
		console.log(`${role} submitted:`, data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
		>
			<h2 className="font-semibold text-lg">{role}</h2>

			<Controller
				name="questions.q1"
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 1"
						value={field.value}
						onChange={field.onChange}
						error={errors.questions?.q1?.message}
					/>
				)}
			/>

			<Controller
				name="questions.q2"
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 2"
						value={field.value}
						onChange={field.onChange}
						error={errors.questions?.q2?.message}
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
				<QuestionForm role="Sales" />
				<QuestionForm role="Scorer" />
			</main>
		</>
	);
}
