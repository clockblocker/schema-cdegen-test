import { z } from "zod";

// Form schemas — "Yes" / "No" / undefined
export const yesNo = z.enum(["Yes", "No"]);
export const yesNoOrUndefined = yesNo.optional();

// Field-level converters between server booleans and form "Yes"/"No"
export function boolToYesNo(v: boolean): "Yes" | "No";
export function boolToYesNo(v: boolean | undefined): "Yes" | "No" | undefined;
export function boolToYesNo(v: boolean | undefined): "Yes" | "No" | undefined {
	return v === undefined ? undefined : v ? "Yes" : "No";
}

export function yesNoToBool(v: "Yes" | "No"): boolean;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined;
export function yesNoToBool(v: "Yes" | "No" | undefined): boolean | undefined {
	return v === undefined ? undefined : v === "Yes";
}

