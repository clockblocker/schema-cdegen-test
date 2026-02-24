import { Controller, useFormContext } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import type { Audut } from "../../batteries/batteries-types";

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
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<Audut<"Library">>();

	const questionareErrors = errors.questionare as
		| {
				q1?: { answer?: { message?: string } };
				q2?: { answer?: { message?: string } };
		  }
		| undefined;

	const q1AnswerMessage =
		typeof questionareErrors?.q1?.answer?.message === "string"
			? questionareErrors.q1.answer.message
			: undefined;
	const q2AnswerMessage =
		typeof questionareErrors?.q2?.answer?.message === "string"
			? questionareErrors.q2.answer.message
			: undefined;

	return (
		<div className="flex flex-col gap-6">
			<Controller
				control={control}
				name="questionare.q1.answer"
				render={({ field }) => (
					<YesNoPicker
						error={q1AnswerMessage}
						label="Question 1 answer"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 1 comment</span>
				<input
					{...register("questionare.q1.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 1"
					type="text"
				/>
			</label>

			<Controller
				control={control}
				name="questionare.q2.answer"
				render={({ field }) => (
					<YesNoPicker
						error={q2AnswerMessage}
						label="Question 2 answer"
						onChange={field.onChange}
						value={field.value}
					/>
				)}
			/>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 2 comment</span>
				<input
					{...register("questionare.q2.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 2"
					type="text"
				/>
			</label>
		</div>
	);
}
