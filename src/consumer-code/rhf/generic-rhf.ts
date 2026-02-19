import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { type DefaultValues, FormProvider, useForm } from "react-hook-form";
import { batteriesFor } from "../batteries/batteries";
import type { Scoring } from "../batteries/batteries-types";
import type { ScoringFlavor } from "../business-types";
import { ArFormFields } from "./ar";
import {
	DEFAULT_FORM_CLASS,
	type GenericFormProps,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { LoansFormFields } from "./loans";

function selectFlavorForm<F extends ScoringFlavor>(
	flavor: F,
): {
	formSchema: (typeof batteriesFor)[F]["formSchema"];
	fieldsNode: ReactElement;
} {
	switch (flavor) {
		case "AR":
			return {
				formSchema: batteriesFor.AR
					.formSchema as (typeof batteriesFor)[F]["formSchema"],
				fieldsNode: createElement(ArFormFields),
			};
		case "Loans":
			return {
				formSchema: batteriesFor.Loans
					.formSchema as (typeof batteriesFor)[F]["formSchema"],
				fieldsNode: createElement(LoansFormFields),
			};
		default: {
			const unreachable: never = flavor;
			throw new Error(`Unsupported flavor: ${String(unreachable)}`);
		}
	}
}

export function GenericRhfForm<F extends ScoringFlavor>({
	flavor,
	initialValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: GenericFormProps<F>): ReactElement {
	const { formSchema, fieldsNode } = selectFlavorForm(flavor);
	const defaultValues = initialValue as DefaultValues<Scoring<F>>;

	// biome-ignore lint/suspicious/noExplicitAny: intentional per requested RHF generic signature
	const methods = useForm<Scoring<F>, any, Scoring<F>>({
		resolver: zodResolver(formSchema as never) as never,
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit((formValue: Scoring<F>) => {
		onSubmit?.(formValue);
	});

	const formNode = renderGenericRhfFormShell({
		className,
		submitLabel,
		onSubmit: handleSubmit,
		fieldsNode,
	});

	return createElement(
		FormProvider as never,
		{
			...methods,
			children: formNode,
		} as never,
	);
}

export type { GenericRhfFormProps } from "./generic-rhf.utils";
