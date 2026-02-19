import type { FormEventHandler } from "react";
import { createElement, type ReactElement } from "react";
import type { DefaultValues } from "react-hook-form";
import { Button } from "~/components/ui/button";
import type {
	AudutFormDraft,
	AudutFormValidatedFor,
} from "../batteries/batteries-types";
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
> =
	SharedFormProps & {
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
