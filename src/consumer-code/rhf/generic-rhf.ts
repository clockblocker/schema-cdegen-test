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
	const { formResolver, fieldsNode } = selectBuildingKindFormResolver(
		buildingKind,
		userRole,
	);

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

function selectBuildingKindFormResolver<
	F extends AuditableBuildingKind,
	R extends UserRole,
>(
	buildingKind: F,
	userRole: R,
): {
	formResolver: Resolver<
		AudutFormDraft<F>,
		FormResolverContext<F, R>,
		AudutFormValidatedFor<R, F>
	>;
	fieldsNode: ReactElement;
} {
	switch (buildingKind) {
		case "Hospital":
			return {
				formResolver: batteriesFor.Hospital.formResolverForRole[
					userRole
				] as unknown as Resolver<
					AudutFormDraft<F>,
					FormResolverContext<F, R>,
					AudutFormValidatedFor<R, F>
				>,
				fieldsNode: createElement(HospitalFormFields),
			};
		case "School":
			return {
				formResolver: batteriesFor.School.formResolverForRole[
					userRole
				] as unknown as Resolver<
					AudutFormDraft<F>,
					FormResolverContext<F, R>,
					AudutFormValidatedFor<R, F>
				>,
				fieldsNode: createElement(SchoolFormFields),
			};
		default: {
			const unreachable: never = buildingKind;
			throw new Error(`Unsupported building kind: ${String(unreachable)}`);
		}
	}
}

export type { GenericRhfFormProps } from "./generic-rhf.utils";
