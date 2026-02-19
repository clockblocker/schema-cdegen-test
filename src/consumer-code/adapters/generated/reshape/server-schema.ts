// AUTO-GENERATED FILE. DO NOT EDIT.
// Step 0 input schema received from upstream codegen.
import { z } from "zod";

export const ReshapeServerSchema = z.object({
	l0_f1: z.string(),
	clients: z.array(
		z.object({
			id: z.number(),
			l1_f1: z.string(),
			counterparties: z.array(
				z.object({
					id: z.number(),
					l2_f1: z.string(),
				}),
			),
		}),
	),
});

export type ReshapeServer = z.infer<typeof ReshapeServerSchema>;
