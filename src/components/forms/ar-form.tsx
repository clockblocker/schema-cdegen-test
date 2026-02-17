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
				name="q1l0"
				render={({ field }) => (
					<YesNoPicker
						error={errors.q1l0?.message}
						label="Question 1"
						onChange={(v) => {
							field.onChange(
								v === undefined ? undefined : v === "Yes",
							);
						}}
						value={
							field.value === undefined
								? undefined
								: field.value
									? "Yes"
									: "No"
						}
					/>
				)}
			/>

			<Controller
				control={control}
				name="q2l0"
				render={({ field }) => (
					<YesNoPicker
						error={errors.q2l0?.message}
						label="Question 2"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</>
	);
}
