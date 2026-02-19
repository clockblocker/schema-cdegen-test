import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Scoring } from "../../batteries/generic-batteries";

export function LoansFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<Scoring<"Loans">>();

	const q3Message =
		typeof errors.questions?.q3?.message === "string"
			? errors.questions.q3.message
			: undefined;
	const q4Message =
		typeof errors.questions?.q4?.message === "string"
			? errors.questions.q4.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<Controller
				control={control}
				name="questions.q3"
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
				name="questions.q4"
				render={({ field }) => (
					<YesNoPicker
						error={q4Message}
						label="Question 4"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</div>
	);
}
