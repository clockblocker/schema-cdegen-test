import { createElement, type ReactElement } from "react";
import { type DefaultValues, FormProvider, useForm } from "react-hook-form";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries/batteries-types";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import {
	DEFAULT_FORM_CLASS,
	type FormResolverContext,
	type GenericFormProps,
	getResolver,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { HospitalFormFields } from "./hospital";
import { SchoolFormFields } from "./school";

const fieldsComponentFor = {
	Hospital: HospitalFormFields,
	School: SchoolFormFields,
} as const satisfies Record<AuditableBuildingKind, () => ReactElement>;

export function GenericRhfForm<
	F extends AuditableBuildingKind,
	R extends UserRole,
>({
	buildingKind,
	userRole,
	auditFormValues,
	onSubmit,
	className = DEFAULT_FORM_CLASS,
	submitLabel = "Submit",
}: GenericFormProps<F, R>): ReactElement {
	const fieldsNode = createElement(fieldsComponentFor[buildingKind]);

	const defaultValues = auditFormValues as DefaultValues<AudutFormDraft<F>>;

	const methods = useForm({
		resolver: getResolver(buildingKind, userRole),
		context: { buildingKind, userRole },
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

	const providerProps = {
		...methods,
		children: formNode,
	};

	return createElement(
		FormProvider<
			AudutFormDraft<F>,
			FormResolverContext<F, R>,
			AudutFormValidatedFor<R, F>
		>,
		providerProps,
	);
}

export type { GenericRhfFormProps } from "./generic-rhf.utils";
