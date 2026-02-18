import { yesNoOrUndefined } from "../../wadk-input-schemas";

export function yesNoToBool(v: "Yes" | "No"): boolean;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined {
	return v === undefined ? undefined : v === "Yes";
}

export function boolToYesNo(v: boolean): "Yes" | "No";
export function boolToYesNo(v: boolean | undefined): "Yes" | "No" | undefined;
export function boolToYesNo(v: boolean | undefined): "Yes" | "No" | undefined {
	return v === undefined ? undefined : v ? "Yes" : "No";
}

export const yesNoBool = {
	fromInput: boolToYesNo,
	fromOutput: yesNoToBool,
	outputSchema: yesNoOrUndefined,
};
