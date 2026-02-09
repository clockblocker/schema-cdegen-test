import type z from "zod/v3";
import {
	type LoansServer,
	LoansServerSchema,
} from "../server/loans-server";
import { boolToYesNo, yesNoToBool } from "./atomic/yesNoAndBool";

export const loansServerToForm = (data: LoansServer) => ({
	questionsLoans: {
		q3: boolToYesNo(data.questionsLoans.q3),
		q4: boolToYesNo(data.questionsLoans.q4),
	},
});

export const LoansFormSchema = LoansServerSchema.transform(loansServerToForm);
export type LoansForm = z.infer<typeof LoansFormSchema>;

export const loansFormToServer = (data: LoansForm): LoansServer => ({
	questionsLoans: {
		q3: yesNoToBool(data.questionsLoans.q3),
		q4: yesNoToBool(data.questionsLoans.q4),
	},
});
