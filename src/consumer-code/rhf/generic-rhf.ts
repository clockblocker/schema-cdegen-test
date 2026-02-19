import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { type DefaultValues, FormProvider, useForm } from "react-hook-form";
import { batteriesFor } from "../batteries/batteries";
import type { Audut } from "../batteries/batteries-types";
import type { AuditableBuildingKind } from "../business-types";
import {
	DEFAULT_FORM_CLASS,
	type GenericFormProps,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { HospitalFormFields } from "./hospital";
import { SchoolFormFields } from "./school";

function selectBuildingKindForm<F extends AuditableBuildingKind>(
	buildingKind: F,
): {
	formSchema: (typeof batteriesFor)[F]["formSchema"];
	fieldsNode: ReactElement;
} {
	switch (buildingKind) {
		case "Hospital":
			return {
				formSchema: batteriesFor.Hospital
					.formSchema as (typeof batteriesFor)[F]["formSchema"],
				fieldsNode: createElement(HospitalFormFields),
			};
		case "School":
			return {
				formSchema: batteriesFor.School
					.formSchema as (typeof batteriesFor)[F]["formSchema"],
				fieldsNode: createElement(SchoolFormFields),
			};
		default: {
			const unreachable: never = buildingKind;
			throw new Error(`Unsupported building kind: ${String(unreachable)}`);
		}
	}
}

export function GenericRhfForm<F extends AuditableBuildingKind>({
	buildingKind,
	initialValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: GenericFormProps<F>): ReactElement {
	const { formSchema, fieldsNode } = selectBuildingKindForm(buildingKind);
	const defaultValues = initialValue as DefaultValues<Audut<F>>;

	// biome-ignore lint/suspicious/noExplicitAny: intentional per requested RHF generic signature
	const methods = useForm<Audut<F>, any, Audut<F>>({
		resolver: zodResolver(formSchema as never) as never,
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit((formValue: Audut<F>) => {
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
