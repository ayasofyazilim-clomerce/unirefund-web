import {Expression, ExpressionInstructionsType, ExpressionThresholdsType} from "../types";

// İfade adımları ve açıklamaları
export const expressionInstructions: ExpressionInstructionsType = {
  neutral: "Lütfen kameraya düz bir şekilde bakın 🧑",
  lookLeft: "Lütfen başınızı sola çevirin ⬅️",
  lookRight: "Lütfen başınızı sağa çevirin ➡️",
};

// Eşik değerleri
export const thresholds: ExpressionThresholdsType = {
  neutral: 0.6,
  lookLeft: 0.3, // Kafa dönüş açıları için daha düşük eşik
  lookRight: 0.3, // Kafa dönüş açıları için daha düşük eşik
};

// Tüm olası ifadeler
export const ALL_EXPRESSIONS: Expression[] = ["neutral", "lookLeft", "lookRight"];

// İfade tespiti için kontrol sıklığı (ms)
export const DETECTION_INTERVAL = 200;

// Her ifade için sabit süre (saniye)
export const DEFAULT_DURATION = 5;
