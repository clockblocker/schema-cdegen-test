import Head from "next/head";
import { mockScoringGroups } from "~/components/forms/scoring/mock-data";
import { ScoringForm } from "~/components/forms/scoring/scoring-form";

export default function ScoringPage() {
	return (
		<>
			<Head>
				<title>Scoring Questionnaire</title>
			</Head>
			<main className="flex min-h-screen items-center justify-center p-8">
				<ScoringForm groups={mockScoringGroups} />
			</main>
		</>
	);
}
