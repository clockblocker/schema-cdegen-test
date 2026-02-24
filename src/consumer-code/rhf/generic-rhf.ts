import { createElement, Fragment, type ReactElement } from "react";
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
import { LibraryFormFields, LibraryQuestionnaireFields } from "./library";
import { SchoolFormFields } from "./school";
import {
	SupermarketFormFields,
	SupermarketQuestionnaireFields,
} from "./supermarket";

const fieldsComponentFor = {
	Hospital: HospitalFormFields,
	School: SchoolFormFields,
	Library: LibraryFormFields,
	Supermarket: SupermarketFormFields,
} as const satisfies Record<AuditableBuildingKind, () => ReactElement>;

const questionnaireComponentFor = {
	Hospital: null,
	School: null,
	Library: LibraryQuestionnaireFields,
	Supermarket: SupermarketQuestionnaireFields,
} as const satisfies Record<AuditableBuildingKind, (() => ReactElement) | null>;

type QuestionnaireFormShape = {
	questionare: unknown;
};

function hasQuestionnairePart(
	formValues: unknown,
): formValues is QuestionnaireFormShape {
	if (typeof formValues !== "object" || formValues === null) {
		return false;
	}

	return "questionare" in formValues;
}

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
	const QuestionnaireComponent = questionnaireComponentFor[buildingKind];
	const questionnaireNode =
		QuestionnaireComponent && hasQuestionnairePart(defaultValues)
			? createElement(QuestionnaireComponent)
			: null;
	const mergedFieldsNode = createElement(
		Fragment,
		null,
		fieldsNode,
		questionnaireNode,
	);

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
		fieldsNode: mergedFieldsNode,
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
