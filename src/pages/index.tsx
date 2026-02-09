import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { type Resolver, Controller, useForm } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import { type ServerIn, type ServerOut, ServerOutSchema } from "~/schemas";

// Mock server state
const serverState: ServerIn = {
	questions: {
		q1: undefined,
		q2: undefined,
	},
};

export default function Home() {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ServerIn, unknown, ServerOut>({
		resolver: zodResolver(ServerOutSchema) as Resolver<ServerIn, unknown, ServerOut>,
		defaultValues: serverState,
	});

	const onSubmit = (data: ServerOut) => {
		console.log("Submitted:", data);
	};

	return (
		<>
			<Head>
				<title>Zod + RHF Test</title>
				<meta content="Testing zod3 schemas with react-hook-form" name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>
			<main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
				<div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
					<h1 className="font-extrabold text-4xl text-white tracking-tight">
						Zod 3 + React Hook Form
					</h1>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col gap-6 rounded-xl bg-white/10 p-8"
					>
						<Controller
							name="questions.q1"
							control={control}
							render={({ field }) => (
								<YesNoPicker
									label="Question 1 (required)"
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
									label="Question 2 (optional)"
									value={field.value}
									onChange={field.onChange}
									error={errors.questions?.q2?.message}
								/>
							)}
						/>

						<button
							type="submit"
							className="rounded bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
						>
							Submit
						</button>
					</form>
				</div>
			</main>
		</>
	);
}
