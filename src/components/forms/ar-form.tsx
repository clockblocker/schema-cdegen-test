import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { ArFormIn } from "~/components/schemas/generated-schemas/ar/ar-form";

export function ArFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<ArFormIn>();

	return (
		<>
			<Controller
				name="questions.q1"
				control={control}
				render={({ field }) => (
					<YesNoPicker
						label="Question 1"
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
						label="Question 2"
						value={field.value}
						onChange={field.onChange}
						error={errors.questions?.q2?.message}
					/>
				)}
			/>
		</>
	);
}
