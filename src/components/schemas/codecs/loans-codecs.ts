import { z } from "zod";
import { type LoansServer, LoansServerSchema } from "../server/loans-server";
import { boolToYesNo, yesNoToBool } from "./atomic/yesNoAndBool";
import { yesNoOrUndefined } from "./types";

export const loansServerToForm = (data: LoansServer) => ({
	questionsLoans: {
		q3: boolToYesNo(data.questionsLoans.q3),
		q4: boolToYesNo(data.questionsLoans.q4),
	},
});

export const LoansFormShape = z.object({
	questionsLoans: z.object({
		q3: yesNoOrUndefined,
		q4: yesNoOrUndefined,
	}),
});

export const LoansFormSchema = LoansServerSchema.transform(loansServerToForm).pipe(LoansFormShape);
export type LoansForm = z.infer<typeof LoansFormSchema>;

export const loansFormToServer = (data: LoansForm): LoansServer => ({
	questionsLoans: {
		q3: yesNoToBool(data.questionsLoans.q3),
		q4: yesNoToBool(data.questionsLoans.q4),
	},
});
