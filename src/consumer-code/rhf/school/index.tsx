import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Audut } from "../../batteries/batteries-types";

export function SchoolFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<Audut<"School">>();

	const q3Message =
		typeof errors.questionsSchool?.q3?.message === "string"
			? errors.questionsSchool.q3.message
			: undefined;
	const q4Message =
		typeof errors.questionsSchool?.q4?.message === "string"
			? errors.questionsSchool.q4.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<Controller
				control={control}
				name="questionsSchool.q3"
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
				name="questionsSchool.q4"
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
