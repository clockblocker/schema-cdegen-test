import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { YesNoPicker } from "~/components/YesNoPicker";
import { Button } from "~/components/ui/button";
import type { ArFormIn } from "~/components/generated-schemas/ar/ar-form";
import { type FormOutFor, type Role, defaultValuesFor, schemaFor } from "~/generics";

export function ArForm<R extends Role>({
	role,
}: {
	role: R;
}) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ArFormIn, unknown, FormOutFor<"AR", R>>({
		resolver: zodResolver(schemaFor.AR[role]) as Resolver<ArFormIn, unknown, FormOutFor<"AR", R>>,
		defaultValues: defaultValuesFor.AR,
	});

	const onSubmit = (data: FormOutFor<"AR", R>) => {
		console.log(`AR/${role} submitted:`, data);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-full max-w-sm flex-col gap-6 rounded-lg border p-6"
		>
			<h2 className="font-semibold text-lg">{role}</h2>

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

			<Button type="submit" variant="outline">Submit</Button>
		</form>
	);
}
