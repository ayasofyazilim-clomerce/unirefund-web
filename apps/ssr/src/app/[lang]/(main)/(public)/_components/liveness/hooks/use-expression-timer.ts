import {useState, useRef, useCallback, useEffect} from "react";
import {DEFAULT_DURATION} from "../constants";

/**
 * Canlılık kontrolü zaman yönetimi için hook
 */
export const useExpressionTimer = (onComplete: () => void, totalDuration = DEFAULT_DURATION) => {
  const [timer, setTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(totalDuration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer'ı başlat
  const startTimer = useCallback(() => {
    if (timerRef.current) return; // Zaten çalışan bir timer varsa

    const startTime = Date.now(); // Başlangıç zamanını bir kere alıyoruz
    setTimer(startTime);
    setTimeRemaining(totalDuration);

    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = totalDuration - elapsedSeconds;

      setTimeRemaining(remaining >= 0 ? remaining : 0);

      if (remaining <= 0) {
        // Süre doldu, onComplete callback'i çağır
        resetTimer();
        onComplete();
      }
    }, 1000);
  }, [totalDuration, onComplete]);

  // Timer'ı sıfırla
  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(null);
    setTimeRemaining(totalDuration);
  }, [totalDuration]);

  // Component unmount olduğunda timer'ı temizle
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    timer,
    timeRemaining,
    startTimer,
    resetTimer,
    progress: ((totalDuration - timeRemaining) / totalDuration) * 100,
  };
};
