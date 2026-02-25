import type { z } from "zod";
import type { UiScoringQuestionGroups } from "~/components/forms/audut/questionnaire/model/types";
import type { RawScoringQuestionGroup } from "~/consumer-code/questionnaire-factory";

export type BatteriesRecord<
	TKind extends string,
	TRole extends string,
> = Record<
	TKind,
	AudutBattery<
		TKind,
		TRole,
		z.ZodTypeAny,
		z.ZodTypeAny,
		Record<TRole, z.ZodTypeAny>,
		CodecLike<z.ZodTypeAny, z.ZodTypeAny>
	>
>;

// -- Internal helpers

type CodecLike<
	TServerSchema extends z.ZodTypeAny,
	TFormSchema extends z.ZodTypeAny,
> = {
	fromInput(input: z.infer<TServerSchema>): z.infer<TFormSchema>;
	fromOutput(output: z.infer<TFormSchema>): z.infer<TServerSchema>;
};

type QuestionnaireBuilderLike = {
	questionIds: readonly string[];
	buildQuestionGroups: (
		serverGroups: RawScoringQuestionGroup<string>[],
	) => UiScoringQuestionGroups<string>;
};

type AudutBattery<
	TKind extends string,
	TRole extends string,
	TServerSchema extends z.ZodTypeAny,
	TFormDraftSchema extends z.ZodTypeAny,
	TFormValidatedSchemaForRole extends Record<
		TRole,
		z.ZodType<z.output<TFormDraftSchema>, any, z.input<TFormDraftSchema>>
	>,
	TCodec extends CodecLike<TServerSchema, TFormDraftSchema>,
> = {
	kind: TKind;
	codec: TCodec;
	serverSchema: TServerSchema;
	formSchema: TFormDraftSchema;
	formValidatedSchemaForRole: TFormValidatedSchemaForRole;
	questionnaire?: QuestionnaireBuilderLike;
};
