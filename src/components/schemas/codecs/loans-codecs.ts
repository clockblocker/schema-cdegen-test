import { z } from "zod";
import { boolToYesNo, yesNoOrUndefined } from "../generated-schemas/types";
import { yesNoToBool } from "./atomic/yesNoToBool";
import { LoansServerInSchema, type LoansServerIn } from "../generated-schemas/loans/loans-server";

export const LoansServerToForm = LoansServerInSchema.transform((data) => ({
	questionsLoans: {
		q3: boolToYesNo(data.questionsLoans.q3),
		q4: boolToYesNo(data.questionsLoans.q4),
	},
}));

export const LoansFormToServer = z.object({
	questionsLoans: z.object({
		q3: yesNoOrUndefined,
		q4: yesNoOrUndefined,
	}),
}).transform((data): LoansServerIn => ({
	questionsLoans: {
		q3: yesNoToBool(data.questionsLoans.q3),
		q4: yesNoToBool(data.questionsLoans.q4),
	},
}));
