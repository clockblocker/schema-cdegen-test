export { ArServerSchema, type ArServer } from "../../generated/ar/server-schema";
export { arFieldAdaptersCodec } from "./codec-for-field-adapters";
export { ArServerToFormCodec } from "./codec-for-shape-change-generation";
import type { ArServerToFormCodec as ArServerToFormCodecType } from "./codec-for-shape-change-generation";

export type ArForm = ReturnType<(typeof ArServerToFormCodecType)["fromInput"]>;
