import type { Codec } from "../build-codec";
import { numericStringOrUndefined } from "../types";

export function numberToString(v: number): string;
export function numberToString(v: number | undefined): string | undefined;
export function numberToString(v: number | undefined): string | undefined {
	return v === undefined ? undefined : String(v);
}

export function stringToNumber(v: string): number;
export function stringToNumber(v: string | undefined): number | undefined;
export function stringToNumber(v: string | undefined): number | undefined {
	return v === undefined ? undefined : Number(v);
}

export const stringNumber = {
	toForm: numberToString,
	toServer: stringToNumber,
	schema: numericStringOrUndefined,
} satisfies Codec<number | undefined, string | undefined, typeof numericStringOrUndefined>;
