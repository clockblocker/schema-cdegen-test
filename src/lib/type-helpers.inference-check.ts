import type { AllOptional, SetNonNullable } from "./type-helpers";

type IsMutuallyAssignable<TA, TB> = [TA] extends [TB]
	? [TB] extends [TA]
		? true
		: false
	: false;

type IsNever<T> = [T] extends [never] ? true : false;

type Assert<T extends true> = T;
type AssertFalse<T extends false> = T;

type ArFullScoring = {
	__typename: "ArFullScoring";
	id: number;
	score: number | null;
};

type ArPreScreener = {
	__typename: "ArPreScreener";
	id: number;
	reason: string | null;
};

type TflFullScoring = {
	__typename: "TflFullScoring";
	id: number;
	passed: boolean;
};

type Flavor = "AR" | "TFL";

type Scoring<F extends Flavor> = F extends "AR"
	? ArFullScoring | ArPreScreener
	: TflFullScoring;

type CreatableScoring<F extends Flavor> = SetNonNullable<
	AllOptional<Scoring<F>>,
	"__typename"
>;

type _creatableArIsNotNever = AssertFalse<IsNever<CreatableScoring<"AR">>>;
type _creatableTflIsNotNever = AssertFalse<IsNever<CreatableScoring<"TFL">>>;

type _creatableArMatchesExpected = Assert<
	IsMutuallyAssignable<
		CreatableScoring<"AR">,
		| {
				__typename: "ArFullScoring";
				id?: number;
				score?: number | null;
		  }
		| {
				__typename: "ArPreScreener";
				id?: number;
				reason?: string | null;
		  }
	>
>;

function narrowByTypename<F extends Flavor>(scoring: CreatableScoring<F>) {
	switch (scoring.__typename) {
		case "ArFullScoring": {
			const _score: number | null | undefined = scoring.score;
			return "ar-full" as const;
		}
		case "ArPreScreener": {
			const _reason: string | null | undefined = scoring.reason;
			return "ar-pre" as const;
		}
		case "TflFullScoring": {
			const _passed: boolean | undefined = scoring.passed;
			return "tfl-full" as const;
		}
	}
}

const _validAr: CreatableScoring<"AR"> = { __typename: "ArPreScreener" };

// @ts-expect-error TFL variant is invalid for AR flavor
const _invalidAr: CreatableScoring<"AR"> = { __typename: "TflFullScoring" };

void _validAr;
void narrowByTypename;
