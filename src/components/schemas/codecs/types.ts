import { z } from "zod";

// Form schemas — "Yes" / "No" / undefined
export const yesNo = z.enum(["Yes", "No"]);
export const yesNoOrUndefined = yesNo.optional();
