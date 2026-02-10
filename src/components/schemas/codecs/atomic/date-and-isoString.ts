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
