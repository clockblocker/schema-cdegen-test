import Head from "next/head";
import { ArForm } from "~/components/forms/ar-form";

export default function Home() {
	return (
		<>
			<Head>
				<title>Zod + RHF Test</title>
				<meta content="Testing zod3 schemas with react-hook-form" name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>
			<main className="flex min-h-screen items-center justify-center gap-8 p-8">
				<ArForm role="Sales" />
				<ArForm role="Scorer" />
			</main>
		</>
	);
}
