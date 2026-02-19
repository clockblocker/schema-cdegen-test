import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Scoring } from "../../batteries/generic-batteries";

function dateToInputValue(value: Date | undefined): string {
	if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
		return "";
	}

	return value.toISOString().slice(0, 10);
}

export function ArFormFields() {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<Scoring<"AR">>();

	const l0q2Message =
		typeof errors.l0?.q2?.message === "string"
			? errors.l0.q2.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<Controller
				control={control}
				name="l0.q2"
				render={({ field }) => (
					<YesNoPicker
						error={l0q2Message}
						label="L0 Q2"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">L0 Q3 (number as text)</span>
				<input
					{...register("l0.q3")}
					className="rounded border px-3 py-2"
					placeholder="Enter numeric text"
					type="text"
				/>
			</label>

			<Controller
				control={control}
				name="l0.q4"
				render={({ field }) => (
					<label className="flex flex-col gap-2">
						<span className="font-medium text-sm">L0 Q4 (date)</span>
						<input
							className="rounded border px-3 py-2"
							onChange={(event) => {
								const nextValue = event.target.value;
								field.onChange(
									nextValue === "" ? undefined : new Date(nextValue),
								);
							}}
							type="date"
							value={dateToInputValue(field.value)}
						/>
					</label>
				)}
			/>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">L0 Q5</span>
				<input
					{...register("l0.q5")}
					className="rounded border px-3 py-2"
					placeholder="Text value"
					type="text"
				/>
			</label>
		</div>
	);
}
