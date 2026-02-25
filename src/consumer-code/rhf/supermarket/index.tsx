import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Audut } from "../../batteries/batteries-types";

export function SupermarketFormFields() {
	const {
		control,
		register,
		watch,
		formState: { errors },
	} = useFormContext<Audut<"Supermarket">>();
	const reconstructionMeta = watch("questionnaire.metaForReconstruction");

	const openLateMessage =
		typeof errors.openLate?.message === "string"
			? errors.openLate.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Supermarket name</span>
				<input
					{...register("libraryName")}
					className="rounded border px-3 py-2"
					placeholder="Central supermarket"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">City</span>
				<input
					{...register("address.city")}
					className="rounded border px-3 py-2"
					placeholder="London"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Country</span>
				<input
					{...register("address.country")}
					className="rounded border px-3 py-2"
					placeholder="UK"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">
					Member capacity (numeric text)
				</span>
				<input
					{...register("memberCapacity")}
					className="rounded border px-3 py-2"
					placeholder="1200"
					type="text"
				/>
			</label>

			<Controller
				control={control}
				name="openLate"
				render={({ field }) => (
					<YesNoPicker
						error={openLateMessage}
						label="Open late"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<input
				{...register("questionnaire.metaForReconstruction.serverShapeVersion", {
					valueAsNumber: true,
				})}
				type="hidden"
			/>
			<input
				{...register("questionnaire.metaForReconstruction.source")}
				type="hidden"
			/>

			{reconstructionMeta?.answersMeta.map((answerMeta, index) => (
				<div className="hidden" key={answerMeta.id}>
					<input
						{...register(
							`questionnaire.metaForReconstruction.answersMeta.${index}.id`,
							{
								valueAsNumber: true,
							},
						)}
						type="hidden"
					/>
					<input
						{...register(
							`questionnaire.metaForReconstruction.answersMeta.${index}.level`,
						)}
						type="hidden"
					/>
				</div>
			))}
		</div>
	);
}
