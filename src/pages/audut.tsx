import Head from "next/head";
import { AudutForm } from "~/components/forms/audut/audut-form";
import { mockAudutGroups } from "~/components/forms/audut/mock-data";

export default function AudutPage() {
	return (
		<>
			<Head>
				<title>Audut Questionnaire</title>
			</Head>
			<main className="flex min-h-screen items-center justify-center p-8">
				<AudutForm groups={mockAudutGroups} />
			</main>
		</>
	);
}
