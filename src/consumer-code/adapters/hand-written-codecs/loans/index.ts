import type { LoansServerToFormCodec as LoansServerToFormCodecType } from "./codec-for-shape-change-generation";

export {
	LoansServerSchema,
	type LoansServer,
} from "../../generated/loans/server-schema";
export { loansFieldAdaptersCodec } from "./codec-for-field-adapters";
export { LoansServerToFormCodec } from "./codec-for-shape-change-generation";

export type LoansForm = ReturnType<
	(typeof LoansServerToFormCodecType)["fromInput"]
>;
