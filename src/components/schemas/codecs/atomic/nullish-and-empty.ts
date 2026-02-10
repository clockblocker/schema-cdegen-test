export function nullishToEmpty(v: string | null | undefined): string {
	return v ?? "";
}

export function emptyToNullish(v: string): string | undefined {
	return v === "" ? undefined : v;
}
