import type { FormEventHandler } from "react";
import { createElement, type ReactElement } from "react";
import { Button } from "~/components/ui/button";
import type { Scoring } from "../batteries/batteries-types";
import type { ScoringFlavor } from "../business-types";

export const DEFAULT_FORM_CLASS =
	"flex w-full max-w-xl flex-col gap-6 rounded-lg border p-6";

type SharedFormProps = {
	className?: string;
	submitLabel?: string;
};

export type GenericFormProps<F extends ScoringFlavor> = SharedFormProps & {
	flavor: F;
	initialValue: Scoring<F>;
	onSubmit?: (formValue: Scoring<F>) => void;
};

export type GenericRhfFormProps = {
	[F in ScoringFlavor]: GenericFormProps<F>;
}[ScoringFlavor];

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
