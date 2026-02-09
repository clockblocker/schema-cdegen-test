import { Controller, useFormContext } from "react-hook-form";
import type { LoansForm } from "~/components/schemas/codecs/loans-codecs";
import { YesNoPicker } from "~/components/YesNoPicker";

export function LoansFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<LoansForm>();

	return (
		<>
			<Controller
				control={control}
				name="questionsLoans.q3"
				render={({ field }) => (
					<YesNoPicker
						error={errors.questionsLoans?.q3?.message}
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
						error={errors.questionsLoans?.q4?.message}
						label="Question 4"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</>
	);
}
