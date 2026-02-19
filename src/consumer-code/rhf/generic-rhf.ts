import { createElement, type ReactElement } from "react";
import { FormProvider, type Resolver, useForm } from "react-hook-form";
import { batteriesFor } from "../batteries/batteries";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries/batteries-types";
import type { AuditableBuildingKind, UserRole } from "../business-types";
import {
	DEFAULT_FORM_CLASS,
	type GenericFormProps,
	renderGenericRhfFormShell,
} from "./generic-rhf.utils";
import { HospitalFormFields } from "./hospital";
import { SchoolFormFields } from "./school";

const fieldsComponentFor = {
	Hospital: HospitalFormFields,
	School: SchoolFormFields,
} as const satisfies Record<AuditableBuildingKind, () => ReactElement>;

type FormResolverContext<
	F extends AuditableBuildingKind,
	R extends UserRole,
> = {
	buildingKind: F;
	userRole: R;
};

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
	const formResolver = batteriesFor[buildingKind].formResolverForRole[
		userRole
	] as unknown as Resolver<
		AudutFormDraft<F>,
		FormResolverContext<F, R>,
		AudutFormValidatedFor<R, F>
	>;
	const fieldsNode = createElement(fieldsComponentFor[buildingKind]);

	const defaultValues = initialValue;

	const methods = useForm({
		resolver: formResolver,
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
