import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { batteriesFor } from "../batteries/batteries";
import type {
	AudutFormDraft,
	AudutFormValidated,
	AudutFormValidatedSchema,
} from "../batteries/batteries-types";
import type { AuditableBuildingKind } from "../business-types";
import {
	DEFAULT_FORM_CLASS,
	type GenericFormProps,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { HospitalFormFields } from "./hospital";
import { SchoolFormFields } from "./school";

export function GenericRhfForm<F extends AuditableBuildingKind>({
	buildingKind,
	initialValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: GenericFormProps<F>): ReactElement {
	const { formValidatedSchema, fieldsNode } = selectBuildingKindForm(buildingKind);
	const defaultValues = initialValue;

	// biome-ignore lint/suspicious/noExplicitAny: intentional per requested RHF generic signature
	const methods = useForm<AudutFormDraft<F>, any, AudutFormValidated<F>>({
		resolver: zodResolver<AudutFormDraft<F>, any, AudutFormValidated<F>>(
			formValidatedSchema,
		),
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit(
		(formValue: AudutFormValidated<F>) => {
			onSubmit?.(formValue);
		},
	);

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

function selectBuildingKindForm<F extends AuditableBuildingKind>(
	buildingKind: F,
): {
	formValidatedSchema: AudutFormValidatedSchema<F>;
	fieldsNode: ReactElement;
} {
	switch (buildingKind) {
		case "Hospital":
			return {
				formValidatedSchema:
					batteriesFor.Hospital.formValidatedSchema as AudutFormValidatedSchema<F>,
				fieldsNode: createElement(HospitalFormFields),
			};
		case "School":
			return {
				formValidatedSchema:
					batteriesFor.School.formValidatedSchema as AudutFormValidatedSchema<F>,
				fieldsNode: createElement(SchoolFormFields),
			};
		default: {
			const unreachable: never = buildingKind;
			throw new Error(`Unsupported building kind: ${String(unreachable)}`);
		}
	}
}

export type { GenericRhfFormProps } from "./generic-rhf.utils";
