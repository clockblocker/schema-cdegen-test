import { Controller, useFormContext } from "react-hook-form";
import { AudutQuestionnaireForm } from "~/components/forms/audut/questionnaire";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Audut } from "../../batteries/batteries-types";
import {
	LIBRARY_UI_SCORING_QUESTION_GROUPS,
	type LibraryQuestionId,
} from "../../batteries/hand-written-codecs/library/questionnaire-config";

function LibraryQuestionnaireForm() {
	return (
		<AudutQuestionnaireForm<LibraryQuestionId>
			questionGroups={LIBRARY_UI_SCORING_QUESTION_GROUPS}
		/>
	);
}

export function LibraryFormFields() {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<Audut<"Library">>();
	const openLateMessage =
		typeof errors.openLate?.message === "string"
			? errors.openLate.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Library name</span>
				<input
					{...register("libraryName")}
					className="rounded border px-3 py-2"
					placeholder="Central library"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">City</span>
				<input
					{...register("city")}
					className="rounded border px-3 py-2"
					placeholder="London"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Country</span>
				<input
					{...register("country")}
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

export function LibraryQuestionnaireFields() {
	return <LibraryQuestionnaireForm />;
}
