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
	const questionareErrors = errors.questionare as
		| {
				q1?: { answer?: { message?: string } };
				q2?: { answer?: { message?: string } };
				q3?: { answer?: { message?: string } };
				q4?: { answer?: { message?: string } };
				q5?: { answer?: { message?: string } };
				q6?: { answer?: { message?: string } };
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
	const q3AnswerMessage =
		typeof questionareErrors?.q3?.answer?.message === "string"
			? questionareErrors.q3.answer.message
			: undefined;
	const q4AnswerMessage =
		typeof questionareErrors?.q4?.answer?.message === "string"
			? questionareErrors.q4.answer.message
			: undefined;
	const q5AnswerMessage =
		typeof questionareErrors?.q5?.answer?.message === "string"
			? questionareErrors.q5.answer.message
			: undefined;
	const q6AnswerMessage =
		typeof questionareErrors?.q6?.answer?.message === "string"
			? questionareErrors.q6.answer.message
			: undefined;
	const openLateMessage =
		typeof errors.openLate?.message === "string"
			? errors.openLate.message
			: undefined;
	const answersMeta = watch("questionare.answersMeta");

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

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 1 answer</span>
				<input
					{...register("questionare.q1.answer")}
					className="rounded border px-3 py-2"
					placeholder="Yes"
					type="text"
				/>
				{q1AnswerMessage && (
					<p className="text-destructive text-sm">{q1AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 1 comment</span>
				<input
					{...register("questionare.q1.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 1"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 2 answer</span>
				<input
					{...register("questionare.q2.answer")}
					className="rounded border px-3 py-2"
					placeholder="No"
					type="text"
				/>
				{q2AnswerMessage && (
					<p className="text-destructive text-sm">{q2AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 2 comment</span>
				<input
					{...register("questionare.q2.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 2"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 3 answer</span>
				<input
					{...register("questionare.q3.answer")}
					className="rounded border px-3 py-2"
					placeholder="Yes"
					type="text"
				/>
				{q3AnswerMessage && (
					<p className="text-destructive text-sm">{q3AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 3 comment</span>
				<input
					{...register("questionare.q3.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 3"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 4 answer</span>
				<input
					{...register("questionare.q4.answer")}
					className="rounded border px-3 py-2"
					placeholder="No"
					type="text"
				/>
				{q4AnswerMessage && (
					<p className="text-destructive text-sm">{q4AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 4 comment</span>
				<input
					{...register("questionare.q4.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 4"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 5 answer</span>
				<input
					{...register("questionare.q5.answer")}
					className="rounded border px-3 py-2"
					placeholder="Yes"
					type="text"
				/>
				{q5AnswerMessage && (
					<p className="text-destructive text-sm">{q5AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 5 comment</span>
				<input
					{...register("questionare.q5.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 5"
					type="text"
				/>
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 6 answer</span>
				<input
					{...register("questionare.q6.answer")}
					className="rounded border px-3 py-2"
					placeholder="No"
					type="text"
				/>
				{q6AnswerMessage && (
					<p className="text-destructive text-sm">{q6AnswerMessage}</p>
				)}
			</label>

			<label className="flex flex-col gap-2">
				<span className="font-medium text-sm">Question 6 comment</span>
				<input
					{...register("questionare.q6.comment")}
					className="rounded border px-3 py-2"
					placeholder="Comment for question 6"
					type="text"
				/>
			</label>

			{answersMeta?.map((_, index) => (
				<div className="hidden" key={index}>
					<input
						{...register(`questionare.answersMeta.${index}.id`)}
						type="hidden"
					/>
					<input
						{...register(`questionare.answersMeta.${index}.level`)}
						type="hidden"
					/>
				</div>
			))}
		</div>
	);
}
