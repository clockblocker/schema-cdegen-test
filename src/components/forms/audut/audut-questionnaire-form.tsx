import {
	Controller,
	type FieldErrors,
	useFormContext,
	useWatch,
} from "react-hook-form";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import type { Audut } from "~/consumer-code/batteries/batteries-types";
import type {
	UiScoringAnswerTree,
	UiScoringQuestionGroup,
	UiScoringQuestionGroups,
} from "~/consumer-code/supermarket/questionnaire-config";

type SupermarketAudit = Audut<"Supermarket">;
type SupermarketAnswers = SupermarketAudit["questionare"]["answers"];

type AnswerOption = {
	answerId: string;
	node: UiScoringAnswerTree;
};

const TREE_META_KEYS = new Set(["answerText", "grade", "weight"]);

function isAnswerTreeNode(value: unknown): value is UiScoringAnswerTree {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	return typeof (value as { answerText?: unknown }).answerText === "string";
}

function getChildOptions(node: UiScoringAnswerTree): AnswerOption[] {
	const options: AnswerOption[] = [];

	for (const [answerId, value] of Object.entries(node)) {
		if (TREE_META_KEYS.has(answerId) || !isAnswerTreeNode(value)) {
			continue;
		}

		options.push({ answerId, node: value });
	}

	return options;
}

function getQuestionOptions(
	group: UiScoringQuestionGroup,
	questionIndex: number,
	answers: Partial<SupermarketAnswers> | undefined,
): AnswerOption[] {
	if (questionIndex === 0) {
		return getChildOptions(group.answersTree);
	}

	let currentNode: UiScoringAnswerTree = group.answersTree;
	for (let index = 0; index < questionIndex; index++) {
		const question = group.questions[index];
		if (!question) {
			return [];
		}

		const selectedAnswerId = answers?.[question.questionId]?.answer;
		if (!selectedAnswerId) {
			return [];
		}

		const nextNode = currentNode[selectedAnswerId];
		if (!isAnswerTreeNode(nextNode)) {
			return [];
		}
		currentNode = nextNode;
	}

	return getChildOptions(currentNode);
}

function evaluateGroup(
	group: UiScoringQuestionGroup,
	answers: Partial<SupermarketAnswers> | undefined,
): {
	weightedScore: number;
	grade?: string;
} | null {
	let score = 0;
	let currentNode: UiScoringAnswerTree = group.answersTree;
	let currentGrade: string | undefined;

	for (const question of group.questions) {
		const selectedAnswerId = answers?.[question.questionId]?.answer;
		if (!selectedAnswerId) {
			return null;
		}

		const nextNode = currentNode[selectedAnswerId];
		if (!isAnswerTreeNode(nextNode)) {
			return null;
		}

		score += nextNode.weight ?? 0;
		currentGrade = nextNode.grade;
		currentNode = nextNode;
	}

	return {
		weightedScore: score * group.groupWeight,
		grade: currentGrade,
	};
}

function getAnswerErrorMessage(
	errors: FieldErrors<SupermarketAudit>,
	questionId: string,
): string | undefined {
	const message = (errors.questionare as { answers?: Record<string, unknown> })
		?.answers?.[questionId] as { answer?: { message?: unknown } } | undefined;

	return typeof message?.answer?.message === "string"
		? message.answer.message
		: undefined;
}

export function AudutQuestionnaireForm({
	questionGroups,
}: {
	questionGroups: UiScoringQuestionGroups;
}) {
	const {
		control,
		register,
		setValue,
		formState: { errors },
	} = useFormContext<SupermarketAudit>();

	const questionnaireAnswers = useWatch<
		SupermarketAudit,
		"questionare.answers"
	>({
		name: "questionare.answers",
	});

	const groupEvaluations = questionGroups
		.map((group) => evaluateGroup(group, questionnaireAnswers))
		.filter((evaluation): evaluation is NonNullable<typeof evaluation> =>
			Boolean(evaluation),
		);

	const totalScore = groupEvaluations.reduce(
		(total, evaluation) => total + evaluation.weightedScore,
		0,
	);

	return (
		<div className="flex flex-col gap-6">
			<h3 className="font-semibold text-base">Questionnaire</h3>
			{questionGroups.map((group, groupIndex) => {
				const evaluation = evaluateGroup(group, questionnaireAnswers);
				return (
					<fieldset
						className="flex flex-col gap-4 rounded-lg border p-4"
						key={`group-${groupIndex + 1}`}
					>
						<div className="flex items-center justify-between gap-2">
							<legend className="font-medium text-sm">
								Group {groupIndex + 1}
							</legend>
							{evaluation && (
								<span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground text-xs">
									Score: {evaluation.weightedScore}
									{evaluation.grade ? ` • ${evaluation.grade}` : ""}
								</span>
							)}
						</div>

						{group.questions.map((question, questionIndex) => {
							const options = getQuestionOptions(
								group,
								questionIndex,
								questionnaireAnswers,
							);
							const disabled = questionIndex > 0 && options.length === 0;
							const answerFieldName =
								`questionare.answers.${question.questionId}.answer` as const;
							const commentFieldName =
								`questionare.answers.${question.questionId}.comment` as const;
							const answerError = getAnswerErrorMessage(
								errors,
								question.questionId,
							);

							return (
								<div className="flex flex-col gap-2" key={question.questionId}>
									<Label>{question.questionText}</Label>
									<Controller
										control={control}
										name={answerFieldName}
										render={({ field }) => (
											<Select
												disabled={disabled}
												onValueChange={(value) => {
													field.onChange(value);
													for (const nextQuestion of group.questions.slice(
														questionIndex + 1,
													)) {
														setValue(
															`questionare.answers.${nextQuestion.questionId}.answer`,
															null,
															{ shouldDirty: true, shouldValidate: true },
														);
														setValue(
															`questionare.answers.${nextQuestion.questionId}.comment`,
															"",
															{ shouldDirty: true },
														);
													}
												}}
												value={field.value ?? ""}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select an answer..." />
												</SelectTrigger>
												<SelectContent>
													{options.map((option) => (
														<SelectItem
															key={option.answerId}
															value={option.answerId}
														>
															{option.node.answerText}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
									{answerError && (
										<p className="text-destructive text-sm">{answerError}</p>
									)}
									<input
										{...register(commentFieldName)}
										className="rounded border px-3 py-2"
										placeholder="Comment"
										type="text"
									/>
								</div>
							);
						})}
					</fieldset>
				);
			})}

			{groupEvaluations.length > 0 && (
				<div className="rounded-lg border border-dashed p-4 text-center font-semibold text-sm">
					Total Score: {totalScore}
				</div>
			)}
		</div>
	);
}
