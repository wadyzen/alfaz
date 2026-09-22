import { useState, useEffect, useRef, useCallback } from "react";

export function useChrono(timeLimit = 120) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const intervalRef = useRef(null);

  const isFirstStartRef = useRef(true);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Stop the timer when user wins
  const stopOnWin = useCallback(() => {
    setHasWon(true);
    pauseChrono();
  }, []);

  // Start or resume the timer
  const startChrono = useCallback(() => {
    // Don't start if game is won
    if (hasWon) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [hasWon]);

  // Pause the timer
  const pauseChrono = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, []);

  // Reset to full time for new game
  const resetChrono = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(timeLimit);
    setIsRunning(false);
    setIsTimeUp(false);
    setHasWon(false);
    isFirstStartRef.current = true;
  }, [timeLimit]);

  const resetForNewGuess = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeLeft(timeLimit);
    setIsTimeUp(false);
    setIsRunning(false);

  }, [timeLimit]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Get time percentage for progress bar
  const getTimePercentage = useCallback(() => {
    return (timeLeft / timeLimit) * 100;
  }, [timeLeft, timeLimit]);

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    isTimeUp,
    hasWon,
    startChrono,
    pauseChrono,
    resetChrono,
    resetForNewGuess, 
    stopOnWin,
    getTimePercentage,
  };
}
