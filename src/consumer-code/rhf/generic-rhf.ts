import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { batteriesFor } from "../batteries/batteries";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
	AudutFormValidatedSchemaFor,
} from "../batteries/batteries-types";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import {
	DEFAULT_FORM_CLASS,
	type GenericFormProps,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { HospitalFormFields } from "./hospital";
import { SchoolFormFields } from "./school";

export function GenericRhfForm<
	F extends AuditableBuildingKind,
	R extends UserRole,
>({
	buildingKind,
	userRole,
	initialValue,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: GenericFormProps<F, R>): ReactElement {
	const { formValidatedSchema, fieldsNode } =
		selectBuildingKindForm(buildingKind, userRole);

	const defaultValues = initialValue;

	const methods = useForm<AudutFormDraft<F>, any, AudutFormValidatedFor<R, F>>({
		// biome-ignore lint/suspicious/noExplicitAny: intentional per requested RHF generic signature
		resolver: zodResolver<AudutFormDraft<F>, any, AudutFormValidatedFor<R, F>>(
			formValidatedSchema,
		),
		defaultValues,
	});

	const handleSubmit = methods.handleSubmit(
		(formValue: AudutFormValidatedFor<R, F>) => {
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

function selectBuildingKindForm<
	F extends AuditableBuildingKind,
	R extends UserRole,
>(
	buildingKind: F,
	userRole: R,
): {
	formValidatedSchema: AudutFormValidatedSchemaFor<F, R>;
	fieldsNode: ReactElement;
} {
	switch (buildingKind) {
		case "Hospital":
			return {
				formValidatedSchema:
					batteriesFor.Hospital.formValidatedSchemaForRole[
						userRole
					] as AudutFormValidatedSchemaFor<F, R>,
				fieldsNode: createElement(HospitalFormFields),
			};
		case "School":
			return {
				formValidatedSchema:
					batteriesFor.School.formValidatedSchemaForRole[
						userRole
					] as AudutFormValidatedSchemaFor<F, R>,
				fieldsNode: createElement(SchoolFormFields),
			};
		default: {
			const unreachable: never = buildingKind;
			throw new Error(`Unsupported building kind: ${String(unreachable)}`);
		}
	}
}

export type { GenericRhfFormProps } from "./generic-rhf.utils";
