export function yesNoToBool(v: "Yes" | "No"): boolean;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined {
	return v === undefined ? undefined : v === "Yes";
}
