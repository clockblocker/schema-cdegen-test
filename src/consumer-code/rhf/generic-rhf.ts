import { arRHF } from "./ar";
import { loansRHF } from "./loans";

export const rhfByFlavor = {
	AR: arRHF,
	Loans: loansRHF,
} as const;

export type Flavor = keyof typeof rhfByFlavor;

type ServerInputByFlavor = {
	[K in Flavor]: Parameters<(typeof rhfByFlavor)[K]["fromServer"]>[0];
};

type FormOutputByFlavor = {
	[K in Flavor]: ReturnType<(typeof rhfByFlavor)[K]["fromServer"]>;
};

type ServerOutputByFlavor = {
	[K in Flavor]: ReturnType<(typeof rhfByFlavor)[K]["toServer"]>;
};

export function getRHFForFlavor<F extends Flavor>(flavor: F) {
	return rhfByFlavor[flavor];
}

export function serverToForm<F extends Flavor>(
	flavor: F,
	input: ServerInputByFlavor[F],
): FormOutputByFlavor[F] {
	const rhf = rhfByFlavor[flavor];
	return rhf.fromServer(input as never) as FormOutputByFlavor[F];
}

export function formToServer<F extends Flavor>(
	flavor: F,
	output: FormOutputByFlavor[F],
): ServerOutputByFlavor[F] {
	const rhf = rhfByFlavor[flavor];
	return rhf.toServer(output as never) as ServerOutputByFlavor[F];
}
