import { zodResolver } from "@hookform/resolvers/zod";
import { createElement, type ReactElement } from "react";
import { FormProvider, type Resolver, useForm } from "react-hook-form";
import type { z } from "zod";
import { batteriesFor } from "../batteries/batteries";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries/batteries-types";
import type { FormResolverContext } from "../batteries/helper-shapes";
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

export function getResolver<
	F extends AuditableBuildingKind,
	R extends UserRole,
>(
	buildingKind: F,
	userRole: R,
	batteries: typeof batteriesFor = batteriesFor,
): Resolver<
	z.input<(typeof batteriesFor)[F]["formSchema"]>,
	FormResolverContext<F, R>,
	z.output<(typeof batteriesFor)[F]["formValidatedSchemaForRole"][R]>
> {
	const schema = batteries[buildingKind].formValidatedSchemaForRole[
		userRole
	] as (typeof batteriesFor)[F]["formValidatedSchemaForRole"][R];

	return zodResolver(schema as never) as unknown as Resolver<
		z.input<(typeof batteriesFor)[F]["formSchema"]>,
		FormResolverContext<F, R>,
		z.output<(typeof batteriesFor)[F]["formValidatedSchemaForRole"][R]>
	>;
}

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
	const fieldsNode = createElement(fieldsComponentFor[buildingKind]);

	const defaultValues = initialValue;

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
