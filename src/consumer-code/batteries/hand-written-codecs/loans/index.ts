import type { LoansServerToFormCodec as LoansServerToFormCodecType } from "./shape-change";

export {
	LoansServerSchema,
	type LoansServer,
} from "../../generated/loans/server-schema";
export { loansFieldAdaptersCodec } from "./field-adapters";
export { LoansServerToFormCodec } from "./shape-change";

export type LoansForm = ReturnType<
	(typeof LoansServerToFormCodecType)["fromInput"]
>;
