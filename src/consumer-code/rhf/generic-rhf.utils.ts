import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler } from "react";
import { createElement, type ReactElement } from "react";
import type { DefaultValues, Resolver } from "react-hook-form";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import { batteriesFor } from "../batteries/batteries";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries/batteries-types";
import type { FormResolverContext } from "../batteries/helper-shapes";
import type { AuditableBuildingKind, UserRole } from "../business-types";

export const DEFAULT_FORM_CLASS =
	"flex w-full max-w-xl flex-col gap-6 rounded-lg border p-6";

type SharedFormProps = {
	className?: string;
	submitLabel?: string;
};

export type GenericFormProps<
	F extends AuditableBuildingKind,
	R extends UserRole = UserRole,
> = SharedFormProps & {
	buildingKind: F;
	userRole: R;
	initialValue: DefaultValues<AudutFormDraft<F>>;
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
