import { z } from "zod";

// Form schemas — "Yes" / "No" / undefined
export const yesNo = z.enum(["Yes", "No"]);
export const yesNoOrUndefined = yesNo.optional();

// Form schemas — numeric strings
export const numericString = z.string();
export const numericStringOrUndefined = numericString.optional();

// Form schemas — Date
export const dateValue = z.date();
export const dateValueOrUndefined = dateValue.optional();

// Form schemas — non-nullish string (empty string represents absence)
export const nonNullishString = z.string();
