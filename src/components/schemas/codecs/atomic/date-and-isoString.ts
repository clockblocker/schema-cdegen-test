import type { Codec } from "../build-codec";
import { dateValueOrUndefined } from "../types";

export function isoStringToDate(v: string): Date;
export function isoStringToDate(v: string | undefined): Date | undefined;
export function isoStringToDate(v: string | undefined): Date | undefined {
	return v === undefined ? undefined : new Date(v);
}

export function dateToIsoString(v: Date): string;
export function dateToIsoString(v: Date | undefined): string | undefined;
export function dateToIsoString(v: Date | undefined): string | undefined {
	return v === undefined ? undefined : v.toISOString();
}

export const dateIso = {
	toForm: isoStringToDate,
	toServer: dateToIsoString,
	schema: dateValueOrUndefined,
} satisfies Codec<string | undefined, Date | undefined, typeof dateValueOrUndefined>;
