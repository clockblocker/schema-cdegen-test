import { Controller, useFormContext } from "react-hook-form";
import type { ArForm } from "~/components/schemas/codecs/ar-codecs";
import { YesNoPicker } from "~/components/YesNoPicker";

export function ArFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<ArForm>();

	return (
		<>
			<Controller
				control={control}
				name="questions.q1"
				render={({ field }) => (
					<YesNoPicker
						error={errors.questions?.q1?.message}
						label="Question 1"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<Controller
				control={control}
				name="questions.q2"
				render={({ field }) => (
					<YesNoPicker
						error={errors.questions?.q2?.message}
						label="Question 2"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</>
	);
}
