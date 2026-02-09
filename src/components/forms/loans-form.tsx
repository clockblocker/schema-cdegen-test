import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { LoansFormIn } from "~/components/schemas/generated-schemas/loans/loans-form";

export function LoansFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<LoansFormIn>();

	return (
		<>
			<Controller
				name="questionsLoans.q3"
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 3"
						value={field.value}
						onChange={field.onChange}
						error={errors.questionsLoans?.q3?.message}
					/>
				)}
			/>

			<Controller
				name="questionsLoans.q4"
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 4"
						value={field.value}
						onChange={field.onChange}
						error={errors.questionsLoans?.q4?.message}
					/>
				)}
			/>
		</>
	);
}
