import type { ArServerToFormCodec as ArServerToFormCodecType } from "./shape-change";

export { ArServerSchema, type ArServer } from "../../generated/ar/server-schema";
export { arFieldAdaptersCodec } from "./field-adapters";
export { ArServerToFormCodec } from "./shape-change";

export type ArForm = ReturnType<(typeof ArServerToFormCodecType)["fromInput"]>;
