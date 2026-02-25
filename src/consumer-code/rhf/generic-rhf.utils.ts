import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler } from "react";
import { createElement, type ReactElement } from "react";
import type { Resolver } from "react-hook-form";
import type { z } from "zod";
import type { ScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import { Button } from "~/components/ui/button";
import { batteriesFor } from "../batteries/batteries";
import type {
	AuditKindWithQuestionnarie,
	AudutFormDraft,
	AudutFormValidatedFor,
	QuestionIdFor,
} from "../batteries/batteries-types";

import type { AuditableBuildingKind, UserRole } from "../business-types";

export const DEFAULT_FORM_CLASS =
	"flex w-full max-w-xl flex-col gap-6 rounded-lg border p-6";

export type FormResolverContext<TKind extends string, TRole extends string> = {
	buildingKind: TKind;
	userRole: TRole;
};

type SharedFormProps = {
	className?: string;
	submitLabel?: string;
};

type QuestionnaireProps<F extends AuditableBuildingKind> =
	F extends AuditKindWithQuestionnarie
		? { questionGroups: ScoringQuestionGroups<QuestionIdFor<F>> }
		: { questionGroups?: never };

export type GenericFormProps<
	F extends AuditableBuildingKind,
	R extends UserRole = UserRole,
> = SharedFormProps &
	QuestionnaireProps<F> & {
		buildingKind: F;
		userRole: R;
		auditFormValues: AudutFormDraft<F>;
		onSubmit?: (formValue: AudutFormValidatedFor<R, F>) => void;
	};

export type GenericRhfFormProps = {
	[F in AuditableBuildingKind]: {
		[R in UserRole]: GenericFormProps<F, R>;
	}[UserRole];
}[AuditableBuildingKind];

type FormShellProps = {
	className: string;
	submitLabel: string;
	onSubmit: FormEventHandler<HTMLFormElement>;
	fieldsNode: ReactElement;
};

export function renderGenericRhfFormShell({
	className,
	submitLabel,
	onSubmit,
	fieldsNode,
}: FormShellProps): ReactElement {
	return createElement(
		"form",
		{ className, onSubmit },
		fieldsNode,
		createElement(Button, { type: "submit", variant: "outline" }, submitLabel),
	);
}

export function getResolver<
	F extends AuditableBuildingKind,
	R extends UserRole,
>(buildingKind: F, userRole: R) {
	const schema = batteriesFor[buildingKind].formValidatedSchemaForRole[
		userRole
	] as (typeof batteriesFor)[F]["formValidatedSchemaForRole"][R];

	return zodResolver(schema as never) as unknown as Resolver<
		z.input<(typeof batteriesFor)[F]["formSchema"]>,
		FormResolverContext<F, R>,
		z.output<(typeof batteriesFor)[F]["formValidatedSchemaForRole"][R]>
	>;
}
