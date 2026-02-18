import { numericStringOrUndefined } from "../../wadk-input-schemas";
import { defineCodec } from "../build-codec";

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

export const stringNumber = defineCodec({
	fromInput: numberToString,
	fromOutput: stringToNumber,
	outputSchema: numericStringOrUndefined,
});
