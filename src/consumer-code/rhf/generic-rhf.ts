import { createElement, Fragment, type ReactElement } from "react";
import { type DefaultValues, FormProvider, useForm } from "react-hook-form";
import { AudutQuestionnaireForm } from "~/components/forms/audut/questionnaire";
import type {
	AuditKindWithQuestionnarie,
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
import { LibraryFormFields } from "./library";
import { SchoolFormFields } from "./school";
import { SupermarketFormFields } from "./supermarket";

const fieldsComponentFor = {
	Hospital: HospitalFormFields,
	School: SchoolFormFields,
	Library: LibraryFormFields,
	Supermarket: SupermarketFormFields,
} as const satisfies Record<AuditableBuildingKind, () => ReactElement>;

const questionnaireKinds = {
	Library: true,
	Supermarket: true,
} as const satisfies Record<AuditKindWithQuestionnarie, true>;

type QuestionnairePropsByKind<R extends UserRole> = GenericFormProps<
	AuditKindWithQuestionnarie,
	R
>;

function isQuestionnaireKind(
	buildingKind: AuditableBuildingKind,
): buildingKind is AuditKindWithQuestionnarie {
	return buildingKind in questionnaireKinds;
}

export function GenericRhfForm<
	F extends AuditableBuildingKind,
	R extends UserRole,
>(props: GenericFormProps<F, R>): ReactElement {
	const {
		buildingKind,
		userRole,
		auditFormValues,
		onSubmit,
		className = DEFAULT_FORM_CLASS,
		submitLabel = "Submit",
	} = props;

	const fieldsNode = createElement(fieldsComponentFor[buildingKind]);
	const defaultValues = auditFormValues as DefaultValues<AudutFormDraft<F>>;
	const questionnaireNode = isQuestionnaireKind(buildingKind)
		? createElement(AudutQuestionnaireForm, {
				questionGroups: (props as QuestionnairePropsByKind<R>).questionGroups,
			})
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
