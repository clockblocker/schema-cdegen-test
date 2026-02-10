import { nonNullishString } from "../../wadk-input-schemas";
import type { Codec } from "../build-codec";

export function nullishToEmpty(v: string | null | undefined): string {
	return v ?? "";
}

export function emptyToNullish(v: string): string | undefined {
	return v === "" ? undefined : v;
}

export const nullishEmpty = {
	toForm: nullishToEmpty,
	toServer: emptyToNullish,
	schema: nonNullishString,
} satisfies Codec<string | null | undefined, string, typeof nonNullishString>;
