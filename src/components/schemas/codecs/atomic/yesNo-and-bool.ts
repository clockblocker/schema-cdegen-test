import type { Codec } from "../build-codec";
import { yesNoOrUndefined } from "../types";

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
	toForm: boolToYesNo,
	toServer: yesNoToBool,
	schema: yesNoOrUndefined,
} satisfies Codec<boolean | undefined, "Yes" | "No" | undefined, typeof yesNoOrUndefined>;
