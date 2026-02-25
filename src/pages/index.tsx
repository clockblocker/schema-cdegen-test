import Head from "next/head";
import { batteriesFor } from "~/consumer-code/batteries/batteries";
import { SupermarketServerSchema } from "~/consumer-code/batteries/generated/supermarket/server-schema";
import { SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS } from "~/consumer-code/batteries/generated/supermarket/server-scoring-question-groups";
import { buildParsedScoringQuestionGroups } from "~/consumer-code/questionnaire-factory";
import { GenericRhfForm } from "~/consumer-code/rhf/generic-rhf";

const supermarketServerSample = SupermarketServerSchema.parse({
	sm_q01_answer: "",
	sm_q01_comment: "",
	sm_q05_answer: "",
	sm_q05_comment: "",
	sm_q06_answer: "",
	sm_q06_comment: "",
	sm_q07_answer: "",
	sm_q07_comment: "",
	sm_q08_answer: "",
	sm_q08_comment: "",
	sm_q09_answer: "",
	sm_q09_comment: "",
	sm_q10_answer: "",
	sm_q10_comment: "",
	sm_q11_answer: "",
	sm_q11_comment: "",
	id: 77,
	dateOfConstuction: "2020-07-01",
	answers: [
		{
			id: 101,
			level: "L1",
			sm_lvl_q02_answer: "",
			sm_lvl_q02_comment: "",
			sm_lvl_q03_answer: "",
			sm_lvl_q03_comment: "",
			sm_lvl_q04_answer: "",
			sm_lvl_q04_comment: "",
		},
	],
	libraryName: "Central Supermarket",
	memberCapacity: 1250,
	openLate: true,
	address: {
		city: "Berlin",
		country: "Germany",
	},
});

const supermarketFormValues = batteriesFor.Supermarket.codec.fromInput(
	supermarketServerSample,
);

const fetchedSupermarketQuestionGroups = SUPERMARKET_SERVER_SCORING_QUESTION_GROUPS;
const supermarketQuestionGroups = buildParsedScoringQuestionGroups(
	"Supermarket",
	fetchedSupermarketQuestionGroups,
);

export default function Home() {
	return (
		<>
			<Head>
				<title>Supermarket Audit</title>
				<meta
					content="Supermarket audit form with dynamic questionnaire"
					name="description"
				/>
				<link href="/favicon.ico" rel="icon" />
			</Head>
			<main className="flex min-h-screen items-start justify-center p-8">
				<GenericRhfForm
					auditFormValues={supermarketFormValues}
					buildingKind="Supermarket"
					onSubmit={(formValue) => {
						console.log("Supermarket/Electrician submitted:", formValue);
					}}
					questionGroups={supermarketQuestionGroups}
					submitLabel="Submit Supermarket Audit"
					userRole="Electrician"
				/>
			</main>
		</>
	);
}
