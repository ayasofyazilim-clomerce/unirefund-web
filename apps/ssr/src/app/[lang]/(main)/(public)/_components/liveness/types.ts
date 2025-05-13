export type Expression = "neutral" | "lookLeft" | "lookRight";
export type Step = Expression | "done";
export type ExpressionStatus = "waiting" | "detected" | "lost";
export type ExpressionValues = Record<string, number>;

export type ExpressionInstructionsType = Record<string, string>;

export type ExpressionThresholdsType = Record<string, number>;
