import { Controller, useFormContext } from "react-hook-form";
import type { LoansForm } from "~/components/schemas/codecs/loans-codecs";
import { YesNoPicker } from "~/components/YesNoPicker";

export function LoansFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<LoansForm>();
	const q3Message =
		typeof errors.questionsLoans?.q3?.message === "string"
			? errors.questionsLoans.q3.message
			: undefined;
	const q4Message =
		typeof errors.questionsLoans?.q4?.message === "string"
			? errors.questionsLoans.q4.message
			: undefined;

	return (
		<>
			<Controller
				control={control}
				name="questionsLoans.q3"
				render={({ field }) => (
					<YesNoPicker
						error={q3Message}
						label="Question 3"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<Controller
				control={control}
				name="questionsLoans.q4"
				render={({ field }) => (
					<YesNoPicker
						error={q4Message}
						label="Question 4"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</>
	);
}
