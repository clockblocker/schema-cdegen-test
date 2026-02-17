import { Controller, useFormContext } from "react-hook-form";
import type { ArForm } from "~/components/schemas/codecs/ar-codecs";
import { YesNoPicker } from "~/components/YesNoPicker";

export function ArFormFields() {
	const {
		control,
		formState: { errors },
	} = useFormContext<ArForm>();
	const q1Message =
		typeof errors.q1l0?.message === "string" ? errors.q1l0.message : undefined;
	const q2Message =
		typeof errors.q2l0?.message === "string" ? errors.q2l0.message : undefined;

	return (
		<>
			<Controller
				control={control}
				name="q1l0"
				render={({ field }) => (
					<YesNoPicker
						error={q1Message}
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
						error={q2Message}
						label="Question 2"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>
		</>
	);
}
