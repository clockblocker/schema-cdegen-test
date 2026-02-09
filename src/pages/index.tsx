import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { type Resolver, Controller, useForm } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import { Button } from "~/components/ui/button";
import {
	type FormIn,
	SalesFormOutSchema,
	ScorerFormOutSchema,
} from "~/schemas";

type FormOutSchema = typeof SalesFormOutSchema | typeof ScorerFormOutSchema;

const defaultValues: FormIn = {
	questions: {
		q1: undefined,
		q2: undefined,
	},
};

function QuestionForm({
	title,
	schema,
}: {
	title: string;
	schema: FormOutSchema;
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormIn>({
		resolver: zodResolver(schema) as Resolver<FormIn>,
		defaultValues,
	});

	const onSubmit = (data: FormIn) => {
		console.log(`${title} submitted:`, data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
		>
			<h2 className="font-semibold text-lg">{title}</h2>

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
				<QuestionForm title="Sales" schema={SalesFormOutSchema} />
				<QuestionForm title="Scorer" schema={ScorerFormOutSchema} />
			</main>
		</>
	);
}
