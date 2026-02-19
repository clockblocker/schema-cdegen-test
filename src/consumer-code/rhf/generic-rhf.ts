import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { type DefaultValues, FormProvider, useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
	type Scoring,
	type ScoringServerInput,
	scoringBatteries,
} from "../batteries/generic-batteries";
import { ArFormFields } from "./ar";
import { LoansFormFields } from "./loans";

const DEFAULT_FORM_CLASS =
	"flex w-full max-w-xl flex-col gap-6 rounded-lg border p-6";

type SharedFormProps = {
	className?: string;
	submitLabel?: string;
};

type ArGenericFormProps = SharedFormProps & {
	flavor: "AR";
	initialServerValue: ScoringServerInput<"AR">;
	onSubmit?: (
		formValue: Scoring<"AR">,
		serverValue: ScoringServerInput<"AR">,
	) => void;
};

type LoansGenericFormProps = SharedFormProps & {
	flavor: "Loans";
	initialServerValue: ScoringServerInput<"Loans">;
	onSubmit?: (
		formValue: Scoring<"Loans">,
		serverValue: ScoringServerInput<"Loans">,
	) => void;
};

export type GenericRhfFormProps = ArGenericFormProps | LoansGenericFormProps;

function ArGenericForm({
	initialServerValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: Omit<ArGenericFormProps, "flavor">): ReactElement {
	const battery = scoringBatteries.AR;
	const defaultValues = battery.codec.fromInput(
		initialServerValue,
	) as DefaultValues<Scoring<"AR">>;

	const methods = useForm<Scoring<"AR">>({
		resolver: zodResolver(battery.formSchema),
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit((formValue) => {
		const serverValue = battery.codec.fromOutput(
			formValue as never,
		) as ScoringServerInput<"AR">;
		onSubmit?.(formValue, serverValue);
	});

	const submitNode = createElement(
		Button,
		{ type: "submit", variant: "outline" },
		submitLabel,
	);

	const formNode = createElement(
		"form",
		{ className, onSubmit: handleSubmit },
		createElement(ArFormFields),
		submitNode,
	);

	return createElement(
		FormProvider as never,
		{
			...methods,
			children: formNode,
		} as never,
	);
}

function LoansGenericForm({
	initialServerValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: Omit<LoansGenericFormProps, "flavor">): ReactElement {
	const battery = scoringBatteries.Loans;
	const defaultValues = battery.codec.fromInput(
		initialServerValue,
	) as DefaultValues<Scoring<"Loans">>;

	const methods = useForm<Scoring<"Loans">>({
		resolver: zodResolver(battery.formSchema),
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit((formValue) => {
		const serverValue = battery.codec.fromOutput(
			formValue as never,
		) as ScoringServerInput<"Loans">;
		onSubmit?.(formValue, serverValue);
	});

	const submitNode = createElement(
		Button,
		{ type: "submit", variant: "outline" },
		submitLabel,
	);

	const formNode = createElement(
		"form",
		{ className, onSubmit: handleSubmit },
		createElement(LoansFormFields),
		submitNode,
	);

	return createElement(
		FormProvider as never,
		{
			...methods,
			children: formNode,
		} as never,
	);
}

export function GenericRhfForm(props: GenericRhfFormProps): ReactElement {
	if (props.flavor === "AR") {
		return createElement(ArGenericForm, {
			initialServerValue: props.initialServerValue,
			onSubmit: props.onSubmit,
			className: props.className,
			submitLabel: props.submitLabel,
		});
	}

	return createElement(LoansGenericForm, {
		initialServerValue: props.initialServerValue,
		onSubmit: props.onSubmit,
		className: props.className,
		submitLabel: props.submitLabel,
	});
}
