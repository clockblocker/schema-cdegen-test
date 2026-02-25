import { Controller, useFormContext } from "react-hook-form";
import { AudutQuestionnaireForm } from "~/components/forms/audut/questionnaire";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Audut } from "../../batteries/batteries-types";
import {
	SUPERMARKET_UI_SCORING_QUESTION_GROUPS,
	type SupermarketQuestionId,
} from "../../batteries/hand-written-codecs/supermarket/questionnaire-config";

function SupermarketQuestionnaireForm() {
	return (
		<AudutQuestionnaireForm<SupermarketQuestionId, Audut<"Supermarket">>
			questionGroups={SUPERMARKET_UI_SCORING_QUESTION_GROUPS}
		/>
	);
}

export function SupermarketFormFields() {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<Audut<"Supermarket">>();

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
		</div>
	);
}

export function SupermarketQuestionnaireFields() {
	const { register, watch } = useFormContext<Audut<"Supermarket">>();
	const reconstructionMeta = watch("questionare.metaForReconstruction");

	return (
		<>
			<SupermarketQuestionnaireForm />

			<input
				{...register("questionare.metaForReconstruction.serverShapeVersion", {
					valueAsNumber: true,
				})}
				type="hidden"
			/>
			<input
				{...register("questionare.metaForReconstruction.source")}
				type="hidden"
			/>

			{reconstructionMeta?.answersMeta.map((answerMeta, index) => (
				<div className="hidden" key={answerMeta.id}>
					<input
						{...register(
							`questionare.metaForReconstruction.answersMeta.${index}.id`,
							{
								valueAsNumber: true,
							},
						)}
						type="hidden"
					/>
					<input
						{...register(
							`questionare.metaForReconstruction.answersMeta.${index}.level`,
						)}
						type="hidden"
					/>
				</div>
			))}
		</>
	);
}
