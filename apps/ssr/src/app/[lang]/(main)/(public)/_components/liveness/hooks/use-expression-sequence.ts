import {useState, useCallback} from "react";
import {Expression} from "../types";
import {ALL_EXPRESSIONS} from "../constants";

/**
 * İfadelerin rastgele seçilmesi ve yönetimi için özel hook
 */
export const useExpressionSequence = () => {
  const [expressionSequence, setExpressionSequence] = useState<Expression[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Rastgele karıştırma fonksiyonu
  const shuffleArray = useCallback((array: Expression[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Yeni ifade dizisi oluştur - tamamen rastgele
  const generateRandomSequence = useCallback(() => {
    // Tüm ifadeleri karıştır ("neutral" dahil)
    const shuffledExpressions = shuffleArray([...ALL_EXPRESSIONS]);

    setExpressionSequence(shuffledExpressions);
    setCurrentStepIndex(0);
    return shuffledExpressions;
  }, [shuffleArray]);

  // Sonraki adıma geç
  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => prev + 1);
  }, []);

  // Testi sıfırla
  const resetSequence = useCallback(() => {
    generateRandomSequence();
  }, [generateRandomSequence]);

  return {
    expressionSequence,
    currentStepIndex,
    isComplete: currentStepIndex >= expressionSequence.length,
    hasNextStep: currentStepIndex < expressionSequence.length - 1,
    generateRandomSequence,
    goToNextStep,
    resetSequence,
  };
};
